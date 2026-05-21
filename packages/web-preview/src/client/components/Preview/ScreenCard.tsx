import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePreviewStore, selectScreensForLocale } from '../../store';
import { CalloutSelectionOverlay } from './CalloutSelectionOverlay';
import { rectToCalloutSource } from '../../utils/calloutSelectionGeometry';
import { fetchPreviewHtml } from '../../utils/api';
import { buildPreviewBody } from '../../utils/previewBody';
import { useDragPosition } from '../../hooks/useDragPosition';
import { useInstantPatch } from '../../hooks/useInstantPatch';
import { shadowPreviewSurface } from '../../utils/previewSurface';
import { registerPreviewSurface, getPreviewSurface } from '../../utils/previewSurfaceRegistry';
import { ensurePreviewFontsRegistered } from '../../utils/parentFontRegistry';
import { useConfirmDialog } from '../Controls/ConfirmDialog';
import { dataTransferHasFiles } from '../../utils/dragUtils';
import type { TextPosition } from '../../types';

interface ScreenCardProps {
  index: number;
  selected: boolean;
  previewW: number;
  previewH: number;
  scale: number;
  headline: string;
  canRemove: boolean;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  canDuplicate: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDuplicate: () => void;
  renderVersion: number;
  platform: string;
  locale: string;
  deviceFamilies: unknown[];
  // Drag-and-drop reorder
  dragFromIdx: number | null;
  dropIndicator: 'left' | 'right' | null;
  onDragStart: (idx: number) => void;
  onDragEnd: () => void;
  onDragOver: (idx: number, side: 'left' | 'right') => void;
  onDragLeave: (idx: number) => void;
  onDrop: () => void;
  // File drop from OS
  fileDropActive: boolean;
  onFileDragEnter: (idx: number) => void;
  onFileDragLeave: (idx: number) => void;
  onFileDrop: (idx: number, files: File[]) => void;
}

export function ScreenCard({
  index,
  selected,
  previewW,
  previewH,
  dragFromIdx,
  dropIndicator,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  fileDropActive,
  onFileDragEnter,
  onFileDragLeave,
  onFileDrop,
  scale,
  canRemove,
  canMoveLeft,
  canMoveRight,
  canDuplicate,
  onSelect,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onDuplicate,
  renderVersion,
  platform,
  locale,
  deviceFamilies,
}: ScreenCardProps) {
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { confirm, dialog } = useConfirmDialog();
  const [initialLoad, setInitialLoad] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Snapshot model: read the active locale's own screen, not Default's
  // overlaid with locale text. When locale === 'default' this returns
  // state.screens[index] as before.
  const screen = usePreviewStore((s) => selectScreensForLocale(s, s.locale)[index]);
  const localeConfig = usePreviewStore((s) => s.sessionLocales[s.locale]);
  const updateScreen = usePreviewStore((s) => s.updateScreen);
  // Callout drag-to-select source mode. Only the active screen card at the
  // default locale renders the overlay; the store auto-clears this on
  // locale/screen switch.
  const calloutSelectionActive = usePreviewStore(
    (s) => s.calloutSelection !== null && s.selectedScreen === index && s.locale === 'default',
  );
  // Snapshot the in-flight selection's reselectIdx separately so we don't
  // re-render every ScreenCard for an unrelated reselect toggle.
  const calloutReselectIdx = usePreviewStore((s) =>
    s.calloutSelection !== null && s.selectedScreen === index && s.locale === 'default'
      ? s.calloutSelection.reselectIdx
      : null,
  );
  const cancelCalloutSelection = usePreviewStore((s) => s.cancelCalloutSelection);

  // Register a shadow surface for this card. Hooks (useInstantPatch,
  // useDragPosition) and ScreenCard's own observers all read from the
  // registry. Phase 7 removed the iframe alternative — there's only
  // one preview path now.
  useEffect(() => {
    const host = shadowHostRef.current;
    const surface = host ? shadowPreviewSurface(host) : null;
    registerPreviewSurface(index, surface);
    return () => {
      registerPreviewSurface(index, null);
    };
  }, [index]);

  const { patchLoupe, patchCallout } = useInstantPatch();

  const handleDeviceDrop = useCallback(
    (partial: { deviceTop: number; deviceOffsetX: number }) => {
      updateScreen(index, partial);
    },
    [index, updateScreen],
  );

  const handleTextDrop = useCallback(
    (cls: 'headline' | 'subtitle' | 'freeText', pos: TextPosition) => {
      const textPositions = {
        ...(screen?.textPositions ?? { headline: null, subtitle: null, freeText: null }),
      };
      textPositions[cls] = pos;
      updateScreen(index, { textPositions });
    },
    [index, screen?.textPositions, updateScreen],
  );

  const handleAnnotationDrop = useCallback(
    (idx: number, partial: { x: number; y: number }) => {
      if (!screen) return;
      const annotations = screen.annotations.map((a, i) =>
        i === idx ? { ...a, ...partial } : a,
      );
      updateScreen(index, { annotations });
    },
    [index, screen, updateScreen],
  );

  const handleOverlayDrop = useCallback(
    (idx: number, partial: { x: number; y: number }) => {
      if (!screen) return;
      const overlays = (screen.overlays ?? []).map((o, i) =>
        i === idx ? { ...o, ...partial } : o,
      );
      updateScreen(index, { overlays });
    },
    [index, screen, updateScreen],
  );

  const handleLoupeDrop = useCallback(
    (partial: { displayX: number; displayY: number }) => {
      if (!screen?.loupe) return;
      updateScreen(index, { loupe: { ...screen.loupe, ...partial } });
    },
    [index, screen?.loupe, updateScreen],
  );

  // During a loupe drag, patch the iframe directly so both the wrapper
  // position AND the magnified content track the cursor live. The
  // canonical state update happens on release via handleLoupeDrop, so
  // the expensive iframe HTML rewrite only fires once per gesture.
  const handleLoupeInstant = useCallback(
    (partial: { displayX: number; displayY: number }) => {
      if (!screen?.loupe) return;
      patchLoupe({ ...screen.loupe, ...partial });
    },
    [screen?.loupe, patchLoupe],
  );

  const handleSpotlightDrop = useCallback(
    (partial: { x: number; y: number }) => {
      if (!screen?.spotlight) return;
      updateScreen(index, { spotlight: { ...screen.spotlight, ...partial } });
    },
    [index, screen?.spotlight, updateScreen],
  );

  const handleCalloutDrop = useCallback(
    (idx: number, partial: { displayX: number; displayY: number }) => {
      if (!screen) return;
      const callouts = (screen.callouts ?? []).map((c, i) =>
        i === idx ? { ...c, ...partial } : c,
      );
      updateScreen(index, { callouts });
    },
    [index, screen, updateScreen],
  );

  // Pointer-up handler for the drag-to-select source flow. Converts the
  // raw normalised rectangle into a callout source rectangle, then either
  // creates a new callout (reselectIdx === null) or updates the source
  // fields on callout `reselectIdx`. Tiny drags (below the threshold) and
  // missing-state cases just cancel without creating anything.
  const handleCalloutSelectionCommit = useCallback(
    (rect: { u0: number; v0: number; u1: number; v1: number }) => {
      if (!screen) {
        cancelCalloutSelection();
        return;
      }
      const src = rectToCalloutSource(rect.u0, rect.v0, rect.u1, rect.v1);
      if (!src) {
        cancelCalloutSelection();
        return;
      }
      if (calloutReselectIdx === null) {
        // Create. Defaults mirror addCallout in EffectsTab for now; Phase 3
        // will tune them (cardScale, offset placement, etc.) when the
        // polished-pop-out work lands. `sourceLocked: true` opts this
        // callout into the decoupled rendering: dragging the card later
        // moves only the card on canvas, the cropped content stays put.
        const newCallout = {
          id: `callout-${crypto.randomUUID().slice(0, 8)}`,
          sourceX: src.sourceX,
          sourceY: src.sourceY,
          sourceW: src.sourceW,
          sourceH: src.sourceH,
          displayX: src.displayX,
          displayY: src.displayY,
          displayScale: 1,
          rotation: 0,
          borderRadius: 16,
          shadow: true,
          borderWidth: 0,
          borderColor: '#ffffff',
          background: '#ffffff',
          padding: 0,
          cardScale: 1,
          sourceLocked: true,
        };
        updateScreen(index, { callouts: [...(screen.callouts ?? []), newCallout] });
      } else {
        // Reselect — preserve everything except the source rectangle and
        // the card centre. Phase 4 wires the entry point that sets
        // reselectIdx; the create path uses null. Reselecting also opts
        // the callout into the decoupled model, since the user has just
        // expressed an intent about the source region.
        const existing = screen.callouts[calloutReselectIdx];
        if (!existing) {
          cancelCalloutSelection();
          return;
        }
        const updated = {
          ...existing,
          sourceX: src.sourceX,
          sourceY: src.sourceY,
          sourceW: src.sourceW,
          sourceH: src.sourceH,
          displayX: src.displayX,
          displayY: src.displayY,
          sourceLocked: true,
        };
        const callouts = screen.callouts.map((c, i) => (i === calloutReselectIdx ? updated : c));
        updateScreen(index, { callouts });
      }
      cancelCalloutSelection();
    },
    [screen, calloutReselectIdx, index, updateScreen, cancelCalloutSelection],
  );

  // Live callout patch — repositions the card AND re-crops the image
  // inside so the magnified content tracks the cursor during drag.
  // State update is deferred to release via handleCalloutDrop.
  const handleCalloutInstant = useCallback(
    (idx: number, partial: { displayX: number; displayY: number }) => {
      if (!screen) return;
      const co = screen.callouts[idx];
      if (!co) return;
      patchCallout(idx, { ...co, ...partial });
    },
    [screen, patchCallout],
  );

  // Non-default locales are frozen for structural data — device frame,
  // annotations, overlays, loupe, spotlight, callouts. Text positions
  // stay editable per locale since translations frequently need
  // different placement to fit longer / shorter copy.
  const allowedDragKinds = useMemo<
    ReadonlyArray<'device' | 'text' | 'annotation' | 'overlay' | 'loupe' | 'spotlight' | 'callout'>
  >(
    () =>
      locale === 'default'
        ? ['device', 'text', 'annotation', 'overlay', 'loupe', 'spotlight', 'callout']
        : ['text'],
    [locale],
  );
  // Stable callback that returns the surface registered for this
  // card. useDragPosition resolves the active PreviewSurface through
  // this rather than touching DOM refs directly.
  const dragGetSurface = useCallback(() => getPreviewSurface(index), [index]);
  const { onOverlayMouseDown, getCursorForPosition, isDragging, dragTarget } = useDragPosition(
    dragGetSurface,
    screen,
    scale,
    previewW,
    previewH,
    handleDeviceDrop,
    handleTextDrop,
    handleAnnotationDrop,
    handleOverlayDrop,
    handleLoupeDrop,
    handleLoupeInstant,
    handleSpotlightDrop,
    handleCalloutDrop,
    handleCalloutInstant,
    allowedDragKinds,
  );

  // Ref-mirrors the latest loupe state so the MutationObserver can refresh
  // the loupe (when the device moves underneath it) without re-attaching
  // the observer on every loupe edit.
  const loupeRef = useRef(screen?.loupe);
  useEffect(() => {
    loupeRef.current = screen?.loupe;
  }, [screen?.loupe]);
  // patchLoupe's identity changes whenever `selectedScreen` flips (it closes
  // over a useCallback chained off the store subscription). Stuffing it in
  // a ref keeps `refreshLoupe` referentially stable so attachGuideObserver
  // and the render effect downstream don't re-fire on every screen click.
  // Without this, clicking any screen card rewrites all 5 iframes at once.
  const patchLoupeRef = useRef(patchLoupe);
  useEffect(() => {
    patchLoupeRef.current = patchLoupe;
  }, [patchLoupe]);
  const refreshLoupe = useCallback(() => {
    if (loupeRef.current) patchLoupeRef.current(loupeRef.current);
  }, []);

  const [cursorStyle, setCursorStyle] = useState('default');
  const [guides, setGuides] = useState<{ horizontal: boolean; vertical: boolean }>({
    horizontal: false,
    vertical: false,
  });
  // Equal-spacing guides — only fire while dragging one of {headline,
  // subtitle, device} AND that element sits at equal centre-to-centre
  // distance from the other two of the trio. All coordinates are
  // iframe-canvas px (intrinsic, pre-scale); the render side
  // multiplies by `scale` to convert to container px.
  // - vertical: dragged is between a TOP and BOTTOM neighbour at the
  //   same Y-gap to each. Brackets are drawn along the dragged's X.
  // - horizontal: same idea on the X axis.
  type EqualSpacingShape = {
    vertical: { topY: number; selfY: number; bottomY: number; centerX: number } | null;
    horizontal: { leftX: number; selfX: number; rightX: number; centerY: number } | null;
  };
  const [equalSpacing, setEqualSpacing] = useState<EqualSpacingShape>({
    vertical: null,
    horizontal: null,
  });
  const equalSpacingRef = useRef(equalSpacing);
  const setEqualSpacingIfChanged = useCallback((next: EqualSpacingShape) => {
    const cur = equalSpacingRef.current;
    // Cheap shape equality: both null shapes match, otherwise compare keys.
    const sameVertical = (cur.vertical === null && next.vertical === null) ||
      (cur.vertical !== null && next.vertical !== null &&
        cur.vertical.topY === next.vertical.topY &&
        cur.vertical.selfY === next.vertical.selfY &&
        cur.vertical.bottomY === next.vertical.bottomY &&
        cur.vertical.centerX === next.vertical.centerX);
    const sameHorizontal = (cur.horizontal === null && next.horizontal === null) ||
      (cur.horizontal !== null && next.horizontal !== null &&
        cur.horizontal.leftX === next.horizontal.leftX &&
        cur.horizontal.selfX === next.horizontal.selfX &&
        cur.horizontal.rightX === next.horizontal.rightX &&
        cur.horizontal.centerY === next.horizontal.centerY);
    if (sameVertical && sameHorizontal) return;
    equalSpacingRef.current = next;
    setEqualSpacing(next);
  }, []);
  // Mirror of `guides` so setGuidesIfChanged can compare against the latest
  // value without re-creating the callback on every render. Without this,
  // recomputeGuides runs on every MutationObserver tick (~60×/sec while
  // dragging) and React schedules a re-render for each one even when both
  // booleans are unchanged — because `{ vertical, horizontal }` is a new
  // object literal every call.
  const guidesRef = useRef(guides);
  const setGuidesIfChanged = useCallback(
    (next: { horizontal: boolean; vertical: boolean }) => {
      if (next.horizontal === guidesRef.current.horizontal && next.vertical === guidesRef.current.vertical) {
        return;
      }
      guidesRef.current = next;
      setGuides(next);
    },
    [],
  );
  const guideObserverRef = useRef<MutationObserver | null>(null);
  // Ref-mirror of dragTarget so recomputeGuides can stay deps-free; the
  // MutationObserver and iframe-rewrite effect that depend on it would
  // otherwise cascade-rerun on every drag start/end.
  const dragTargetRef = useRef(dragTarget);
  useEffect(() => {
    dragTargetRef.current = dragTarget;
  }, [dragTarget]);

  const recomputeGuides = useCallback(() => {
    const target = dragTargetRef.current;
    // No active drag → nothing to align, clear guides. Render-side already
    // gates on isDragging, but clearing here keeps internal state honest.
    if (!target) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const surface = getPreviewSurface(index);
    if (!surface) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const canvas = surface.querySelector('.canvas') as HTMLElement | null;
    if (!canvas) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const cRect = canvas.getBoundingClientRect();
    const cCenterX = cRect.left + cRect.width / 2;
    const cCenterY = cRect.top + cRect.height / 2;
    // Drag offsets are stored as integer percentages of canvas width/height,
    // so each step moves the element by cRect.{w,h}/100 screen px. The guide
    // should fire only on the integer step closest to true center — half a
    // step in either direction.
    const tolerancePxX = cRect.width / 200;
    const tolerancePxY = cRect.height / 200;

    // Pick the single element being dragged. Anything else has no bearing
    // on alignment feedback right now — checking all draggables would light
    // up the device's vertical guide (deviceOffsetX=0 by default) whenever
    // text is being dragged.
    let selector: string;
    if (target.kind === 'device') {
      selector = '.device-wrapper';
    } else if (target.kind === 'text') {
      // freeText maps to the CSS class `.free-text`; headline/subtitle match
      // their cls 1:1.
      selector = target.cls === 'freeText' ? '.free-text' : `.${target.cls}`;
    } else if (target.kind === 'annotation') {
      selector = `.annotation-shape[data-idx="${target.idx}"]`;
    } else if (target.kind === 'overlay') {
      selector = `.overlay-item[data-idx="${target.idx}"]`;
    } else if (target.kind === 'loupe') {
      selector = '.loupe-wrapper';
    } else if (target.kind === 'spotlight') {
      selector = '.spotlight-cutout';
    } else {
      // callout
      selector = `.callout-card[data-idx="${target.idx}"]`;
    }
    const el = surface.querySelector(selector) as HTMLElement | null;
    if (!el) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    // Text elements only produce a meaningful center check once
    // useDragPosition has applied positioning — that's `fixed` in
    // iframe mode and `absolute` in shadow mode (browsers don't honor
    // host-transform-as-fixed-containing-block across shadow roots).
    // In normal flow the block spans the entire text-area and would
    // always read as X-centered.
    const textPos = target.kind === 'text' ? surface.getComputedStyle(el).position : null;
    if (target.kind === 'text' && textPos !== 'fixed' && textPos !== 'absolute') {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const vertical = Math.abs(centerX - cCenterX) <= tolerancePxX;
    const horizontal = Math.abs(centerY - cCenterY) <= tolerancePxY;
    setGuidesIfChanged({ vertical, horizontal });

    // Equal-spacing guides — only for the {headline, subtitle, device}
    // trio. Walks the three element centres and checks whether the
    // dragged one sits between the other two with matching gaps. The
    // tolerance is the same per-axis step size as the centre guides so
    // the bracket only fires when the user genuinely lands on it.
    const isTrioMember =
      target.kind === 'device' ||
      (target.kind === 'text' && (target.cls === 'headline' || target.cls === 'subtitle'));
    if (!isTrioMember) {
      setEqualSpacingIfChanged({ vertical: null, horizontal: null });
      return;
    }
    const trio: Array<{ key: string; cx: number; cy: number; isSelf: boolean }> = [];
    const collect = (sel: string, isSelf: boolean) => {
      const node = surface.querySelector(sel) as HTMLElement | null;
      if (!node) return;
      // Text nodes only have a meaningful centre once dragged to
      // position:fixed (or after the user has dropped them, when
      // they're absolute-positioned). Skip if neither: a flex-
      // block text spans the whole text area and its centre would
      // be misleading.
      if ((sel === '.headline' || sel === '.subtitle' || sel === '.free-text')) {
        const cs = surface.getComputedStyle(node).position;
        if (cs !== 'fixed' && cs !== 'absolute') return;
      }
      const r = node.getBoundingClientRect();
      trio.push({ key: sel, cx: r.left + r.width / 2, cy: r.top + r.height / 2, isSelf });
    };
    const selfSel =
      target.kind === 'device' ? '.device-wrapper' : `.${target.cls}`;
    collect('.device-wrapper', selfSel === '.device-wrapper');
    collect('.headline', selfSel === '.headline');
    collect('.subtitle', selfSel === '.subtitle');
    const self = trio.find((t) => t.isSelf);
    const others = trio.filter((t) => !t.isSelf);
    if (!self || others.length < 2) {
      setEqualSpacingIfChanged({ vertical: null, horizontal: null });
      return;
    }

    // Vertical equal-spacing: dragged sits between the two others on Y.
    let verticalMatch: EqualSpacingShape['vertical'] = null;
    const sortedByY = [...others].sort((a, b) => a.cy - b.cy);
    const top = sortedByY[0];
    const bot = sortedByY[sortedByY.length - 1];
    if (top && bot && top !== bot && top.cy < self.cy && self.cy < bot.cy) {
      const gapAbove = self.cy - top.cy;
      const gapBelow = bot.cy - self.cy;
      if (Math.abs(gapAbove - gapBelow) <= tolerancePxY) {
        verticalMatch = { topY: top.cy, selfY: self.cy, bottomY: bot.cy, centerX: self.cx };
      }
    }
    // Horizontal equal-spacing.
    let horizontalMatch: EqualSpacingShape['horizontal'] = null;
    const sortedByX = [...others].sort((a, b) => a.cx - b.cx);
    const left = sortedByX[0];
    const right = sortedByX[sortedByX.length - 1];
    if (left && right && left !== right && left.cx < self.cx && self.cx < right.cx) {
      const gapLeft = self.cx - left.cx;
      const gapRight = right.cx - self.cx;
      if (Math.abs(gapLeft - gapRight) <= tolerancePxX) {
        horizontalMatch = { leftX: left.cx, selfX: self.cx, rightX: right.cx, centerY: self.cy };
      }
    }
    setEqualSpacingIfChanged({ vertical: verticalMatch, horizontal: horizontalMatch });
  }, [index]);

  // MutationObserver fires only on style mutations, so drag-start (which
  // changes dragTarget but may not yet have moved the element) wouldn't
  // re-run the guide check. Recompute explicitly on every drag transition.
  useEffect(() => {
    recomputeGuides();
  }, [dragTarget, recomputeGuides]);

  // Attach a MutationObserver to every draggable element in the iframe (device
  // wrapper + headline + subtitle). Both slider instant patches and
  // mouse drags mutate inline style attributes, so watching each element's
  // style catches every reposition in real time. The iframe is rewritten on
  // full re-renders, so this is called again from the fetchPreviewHtml .then()
  // below to re-target the new element set.
  const attachGuideObserver = useCallback(() => {
    guideObserverRef.current?.disconnect();
    guideObserverRef.current = null;
    const surface = getPreviewSurface(index);
    if (!surface) return;
    // Same callback handles two responsibilities: keep center guides in
    // sync with the dragged element, and re-sample the loupe whenever the
    // device-wrapper position/size changes so the magnifier tracks live.
    // refreshLoupe is scoped to device-wrapper mutations only — running
    // it on every observed element (annotation, overlay, callout, etc.)
    // adds a full DOM re-patch per tick of every slider / drag, which
    // shows up as stutter on the heavier shapes (callouts especially).
    const onMutation = (records: MutationRecord[]) => {
      recomputeGuides();
      const deviceMoved = records.some((r) => {
        const t = r.target as Element;
        return t.classList?.contains('device-wrapper');
      });
      if (deviceMoved) {
        refreshLoupe();
      }
    };
    const observer = new MutationObserver(onMutation);
    const selectors = ['.device-wrapper', '.headline', '.subtitle', '.free-text'];
    let attached = 0;
    for (const selector of selectors) {
      const el = surface.querySelector(selector) as HTMLElement | null;
      if (!el) continue;
      observer.observe(el, { attributes: true, attributeFilter: ['style'] });
      attached++;
    }
    // Annotations and overlays (elements) are dynamic — observe every shape
    // that exists in the current render. The guide check filters by
    // dragTarget so only the active one matters.
    for (const el of surface.querySelectorAll('.annotation-shape, .overlay-item, .loupe-wrapper, .spotlight-cutout, .callout-card')) {
      observer.observe(el, { attributes: true, attributeFilter: ['style'] });
      attached++;
    }
    if (attached === 0) {
      setGuidesIfChanged({ horizontal: false, vertical: false });
      return;
    }
    recomputeGuides();
    guideObserverRef.current = observer;
  }, [index, recomputeGuides, refreshLoupe]);

  useEffect(() => () => {
    guideObserverRef.current?.disconnect();
    guideObserverRef.current = null;
  }, []);

  const handleOverlayMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setCursorStyle(getCursorForPosition(e.clientX, e.clientY));
    },
    [getCursorForPosition],
  );

  useEffect(() => {
    if (!screen) return;

    // Debounce: wait for rapid changes to settle before fetching
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const body = buildPreviewBody(
        screen,
        platform,
        previewW,
        previewH,
        locale,
        localeConfig,
        deviceFamilies,
        // previewMode = true: swap screenshot URLs to the .previews/ variant
        // so Safari decodes ~5× smaller bitmaps per iframe. Export uses the
        // same body builder with previewMode=false (its default) to keep
        // full-res output.
        true,
      );

      // Register the fonts this screen needs on the parent document
      // before mounting the shadow content, and tell the server to
      // skip @font-face emission since the parent has it covered.
      const fontIds = [screen.font, screen.headlineFont, screen.subtitleFont, screen.freeTextFont].filter(
        (id): id is string => typeof id === 'string' && id.length > 0,
      );
      try {
        await ensurePreviewFontsRegistered(fontIds);
      } catch {
        // Font registration is best-effort; if it fails we fall
        // through to render anyway and let the browser substitute
        // system fonts. The full-render path will surface the
        // network error on its own.
      }
      body.fontFaceMode = 'none';

      if (controller.signal.aborted) return;

      fetchPreviewHtml(body, controller.signal)
        .then((html) => {
          const surface = getPreviewSurface(index);
          if (!surface) return;
          surface.replaceContent(html);
          setInitialLoad(false);
          // The wrapper element is brand new after rewrite — re-target the
          // observer so slider + mouse drags keep firing guide updates.
          requestAnimationFrame(attachGuideObserver);
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          setInitialLoad(false);
        });
    }, initialLoad ? 0 : 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
    // renderVersion forces re-render when triggerRender() is called
  }, [screen, renderVersion, platform, previewW, previewH, locale, localeConfig, deviceFamilies, attachGuideObserver, index]);

  return (
    <>
    {dialog}
    <div
      ref={cardRef}
      className={`shrink-0 cursor-pointer rounded-lg overflow-hidden bg-surface relative ring-1 transition-[box-shadow,border-color,opacity] duration-150 ${
        selected ? 'ring-2 ring-accent shadow-lg' : 'ring-border hover:ring-text-dim'
      } ${dragFromIdx === index ? 'opacity-40' : ''} ${
        fileDropActive ? 'ring-2 ring-accent' : ''
      }`}
      style={{ width: previewW * scale }}
      onClick={onSelect}
      onDragEnter={(e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          onFileDragEnter(index);
        }
      }}
      onDragOver={(e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          // Keep the highlight in case onDragEnter didn't fire (Safari).
          if (!fileDropActive) onFileDragEnter(index);
          return;
        }
        if (dragFromIdx === null || dragFromIdx === index) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // Direction-based: the side is determined by where the drag is
        // coming FROM, not where the cursor is within the target card.
        // Dragging leftward (from a higher index) inserts before; dragging
        // rightward inserts after. The cursor just has to be over the
        // target, no halfway threshold.
        const side: 'left' | 'right' = dragFromIdx > index ? 'left' : 'right';
        onDragOver(index, side);
      }}
      onDragLeave={(e) => {
        // Ignore dragLeave from internal child elements — only the card's
        // boundary counts. relatedTarget is null when leaving the window.
        const next = e.relatedTarget as Node | null;
        if (next && e.currentTarget.contains(next)) return;
        onDragLeave(index);
        onFileDragLeave(index);
      }}
      onDrop={(e) => {
        if (dataTransferHasFiles(e.dataTransfer)) {
          e.preventDefault();
          // Stop the event from bubbling to PreviewArea's onDrop, which
          // also handles file drops and would fire a second upload to
          // `selectedScreen` — replacing two cards from one drop.
          e.stopPropagation();
          const files = Array.from(e.dataTransfer.files);
          onFileDrop(index, files);
          return;
        }
        e.preventDefault();
        onDrop();
      }}
    >
      {/* Drop indicator — vertical bar on the targeted side */}
      {dropIndicator && (
        <div
          className={`absolute top-0 bottom-0 w-1 bg-accent rounded-full pointer-events-none z-10 ${
            dropIndicator === 'left' ? 'left-[-3px]' : 'right-[-3px]'
          }`}
          aria-hidden="true"
        />
      )}
      {/* File-drop overlay — appears when an OS file drag is over this card. */}
      {fileDropActive && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-accent/20 backdrop-blur-[2px] pointer-events-none"
          aria-hidden="true"
        >
          <div className="bg-surface/90 text-text text-xs font-medium px-3 py-1.5 rounded-full shadow">
            Drop to replace screenshot
          </div>
        </div>
      )}
      {/* Header — drag handle. Drags the WHOLE card visually via
          setDragImage(cardRef.current), not just the header strip.
          Below ~110px wide we'd be cramming controls into space that
          isn't there; we strip down to just the screen number. The
          whole header stays a drag source either way. */}
      <div
        className="flex items-center justify-between gap-1 px-2 py-1 bg-surface text-[10px] cursor-grab active:cursor-grabbing overflow-hidden"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          // Setting any drag data is required for Firefox to start the drag.
          e.dataTransfer.setData('text/plain', String(index));
          if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            e.dataTransfer.setDragImage(
              cardRef.current,
              e.clientX - rect.left,
              e.clientY - rect.top,
            );
          }
          onDragStart(index);
        }}
        onDragEnd={onDragEnd}
        title="Drag to reorder"
      >
        {previewW * scale >= 110 ? (
          <>
            {canMoveLeft ? (
              <button
                className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded shrink-0"
                onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
                title="Move left"
                aria-label={`Move screen ${index + 1} left`}
              >
                &lsaquo;
              </button>
            ) : <span className="w-4 shrink-0" />}
            <span className="text-text-dim font-medium truncate min-w-0">Screen {index + 1}</span>
            <div className="flex items-center gap-0.5 shrink-0">
              {canMoveRight && (
                <button
                  className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
                  title="Move right"
                  aria-label={`Move screen ${index + 1} right`}
                >
                  &rsaquo;
                </button>
              )}
              {canDuplicate && (
                <button
                  className="text-text-dim hover:text-text px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded inline-flex items-center"
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                  title="Duplicate screen"
                  aria-label={`Duplicate screen ${index + 1}`}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <rect x="4.5" y="4.5" width="9" height="9" rx="1.5" />
                    <path d="M2.5 11.5V3a.5.5 0 0 1 .5-.5h8.5" />
                  </svg>
                </button>
              )}
              {canRemove && (
                <button
                  className="text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = await confirm({ title: 'Remove Screen', message: `Remove Screen ${index + 1}? This cannot be undone.` });
                    if (ok) onRemove();
                  }}
                  title="Remove screen"
                  aria-label={`Remove screen ${index + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="w-3 shrink-0" />
            <span className="text-text-dim font-medium truncate min-w-0 text-center flex-1">{index + 1}</span>
            {canRemove ? (
              <button
                className="text-text-dim hover:text-red-400 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded shrink-0"
                onClick={async (e) => {
                  e.stopPropagation();
                  const ok = await confirm({ title: 'Remove Screen', message: `Remove Screen ${index + 1}? This cannot be undone.` });
                  if (ok) onRemove();
                }}
                title="Remove screen"
                aria-label={`Remove screen ${index + 1}`}
              >
                &times;
              </button>
            ) : <span className="w-3 shrink-0" />}
          </>
        )}
      </div>

      {/* Preview */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{
          width: previewW * scale,
          height: previewH * scale,
        }}
      >
        {initialLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg z-20">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div
          ref={shadowHostRef}
          className="border-none block origin-top-left"
          style={{
            width: previewW,
            height: previewH,
            // translateZ(0) is doing double duty: it's a no-op visual
            // composite layer hint, and it makes this element a
            // containing block for position:fixed descendants inside
            // its shadow tree (see shadowPreviewSurface). willChange
            // tells the compositor the layer is long-lived. contain
            // scopes layout/paint to this subtree so a bad template
            // rule can't reflow the editor chrome.
            transform: `scale(${scale}) translateZ(0)`,
            willChange: 'transform',
            contain: 'layout style paint',
          }}
          title={`Screen ${index + 1}`}
          aria-label={`Screen ${index + 1}`}
        />
        {/* Center guides — only while actively dragging, and only when the
            dragged element's center exactly hits a canvas axis. */}
        {/* Guide style: each line gets a 1px halo via box-shadow on both
            sides so it stays visible against any background — including
            backgrounds that match its core colour (green on green,
            red on red, etc.). */}
        {isDragging && guides.vertical && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-10"
            style={{ left: '50%', width: 1, background: '#ef4444', transform: 'translateX(-50%)', boxShadow: '1px 0 0 rgba(0,0,0,0.55), -1px 0 0 rgba(0,0,0,0.55)' }}
            aria-hidden="true"
          />
        )}
        {isDragging && guides.horizontal && (
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{ top: '50%', height: 1, background: '#ef4444', transform: 'translateY(-50%)', boxShadow: '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(0,0,0,0.55)' }}
            aria-hidden="true"
          />
        )}
        {/* Equal-spacing brackets. Two short coloured segments along the
            dragged element's perpendicular axis, one for each gap.
            Iframe-canvas px scaled into container px for absolute
            positioning. */}
        {isDragging && equalSpacing.vertical && (() => {
          const e = equalSpacing.vertical;
          const x = Math.round(e.centerX * scale);
          const topY = Math.round(e.topY * scale);
          const selfY = Math.round(e.selfY * scale);
          const botY = Math.round(e.bottomY * scale);
          const color = '#22c55e';
          const lineHalo = '1px 0 0 rgba(0,0,0,0.55), -1px 0 0 rgba(0,0,0,0.55)';
          const tickHalo = '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(0,0,0,0.55)';
          return (
            <>
              <div className="absolute pointer-events-none z-10" style={{ left: x - 4, top: topY - 1, width: 8, height: 2, background: color, boxShadow: tickHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: x, top: topY, width: 1, height: selfY - topY, background: color, boxShadow: lineHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: x - 4, top: selfY - 1, width: 8, height: 2, background: color, boxShadow: tickHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: x, top: selfY, width: 1, height: botY - selfY, background: color, boxShadow: lineHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: x - 4, top: botY - 1, width: 8, height: 2, background: color, boxShadow: tickHalo }} aria-hidden="true" />
            </>
          );
        })()}
        {isDragging && equalSpacing.horizontal && (() => {
          const e = equalSpacing.horizontal;
          const y = Math.round(e.centerY * scale);
          const leftX = Math.round(e.leftX * scale);
          const selfX = Math.round(e.selfX * scale);
          const rightX = Math.round(e.rightX * scale);
          const color = '#22c55e';
          const lineHalo = '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(0,0,0,0.55)';
          const tickHalo = '1px 0 0 rgba(0,0,0,0.55), -1px 0 0 rgba(0,0,0,0.55)';
          return (
            <>
              <div className="absolute pointer-events-none z-10" style={{ left: leftX - 1, top: y - 4, width: 2, height: 8, background: color, boxShadow: tickHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: leftX, top: y, width: selfX - leftX, height: 1, background: color, boxShadow: lineHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: selfX - 1, top: y - 4, width: 2, height: 8, background: color, boxShadow: tickHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: selfX, top: y, width: rightX - selfX, height: 1, background: color, boxShadow: lineHalo }} aria-hidden="true" />
              <div className="absolute pointer-events-none z-10" style={{ left: rightX - 1, top: y - 4, width: 2, height: 8, background: color, boxShadow: tickHalo }} aria-hidden="true" />
            </>
          );
        })()}
        {/* Drag overlay — sits above iframe to capture pointer events.
            useDragPosition is configured per-locale to only allow text
            drags on non-default locales, so device / annotation /
            overlay drags are filtered at the hit-test layer. */}
        <div
          className="absolute inset-0 z-10"
          style={{ cursor: cursorStyle }}
          onMouseDown={onOverlayMouseDown}
          onMouseMove={handleOverlayMouseMove}
        />
        {/* Callout drag-to-select overlay. Z-30 to sit ABOVE the regular
            drag overlay so the existing handlers don't intercept the
            crosshair gesture. Mounted only on the active card at the
            default locale; see store.calloutSelection. */}
        {calloutSelectionActive && (
          <CalloutSelectionOverlay
            screenIndex={index}
            layout={screen?.layout}
            onCommit={handleCalloutSelectionCommit}
          />
        )}
      </div>
    </div>
    </>
  );
}
