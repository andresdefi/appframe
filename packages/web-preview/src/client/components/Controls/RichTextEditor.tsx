import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { ColorPickerPopover } from './ColorPickerPopover';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  /** Plain-text mirror callback — fires alongside onChange with the
   *  selection-free text content so the canonical plain-text field can
   *  stay in sync. */
  onTextChange?: (text: string) => void;
  /** Fires on every keystroke with the latest HTML — caller can patch the
   *  iframe directly for instant feedback while onChange is debounced. */
  onInstant?: (html: string) => void;
  placeholder?: string;
  /** Min height for the editor body in pixels. */
  minHeight?: number;
  /** Debounce ms for onChange. The Tiptap editor itself updates instantly;
   *  this just rate-limits the canonical state update that triggers a
   *  full iframe rebuild. Default 200ms. */
  debounceMs?: number;
  /** Base color for the element (applies when no text is selected at the
   *  moment the toolbar color picker opens). Drives the swatch under the
   *  color button when nothing is selected. */
  baseColor?: string;
  /** Canonical handler for base-color changes. Called when the user picks
   *  a color in the toolbar with no text selected — also strips any
   *  per-span inline colors so the new base is visible everywhere. */
  onBaseColor?: (hex: string) => void;
  /** Live-preview handler for base-color changes. Receives every hex as
   *  the user moves through the color picker. Caller should patch the
   *  iframe directly so the preview updates without a full re-render. */
  onBaseColorInstant?: (hex: string) => void;
}

const TOOLBAR_BTN =
  'inline-flex items-center justify-center w-7 h-7 rounded-md text-text-dim hover:text-text hover:bg-surface transition-colors';
const TOOLBAR_BTN_ACTIVE = 'bg-surface text-text';

function ToolbarButton({
  isActive,
  onClick,
  label,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${TOOLBAR_BTN} ${isActive ? TOOLBAR_BTN_ACTIVE : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={label}
      aria-label={label}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  label,
  value,
  onChange,
  onTextChange,
  onInstant,
  placeholder,
  minHeight = 56,
  debounceMs = 200,
  baseColor,
  onBaseColor,
  onBaseColorInstant,
}: RichTextEditorProps) {
  // Keep latest callbacks in refs so the debounce timer doesn't have to
  // capture them. This avoids resubscribing onUpdate every render.
  const onChangeRef = useRef(onChange);
  const onTextChangeRef = useRef(onTextChange);
  const onInstantRef = useRef(onInstant);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onTextChangeRef.current = onTextChange; }, [onTextChange]);
  useEffect(() => { onInstantRef.current = onInstant; }, [onInstant]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      // StarterKit (v3) already includes Bold, Italic, Underline, Paragraph,
      // History, etc. Add TextStyle + Color for inline color, and TextAlign.
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'center',
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Instant: fires on every keystroke, caller live-patches the iframe.
      if (onInstantRef.current) onInstantRef.current(html);
      // Debounced canonical update — avoids triggering a full template
      // re-render on each keystroke.
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onChangeRef.current(html);
        if (onTextChangeRef.current) onTextChangeRef.current(editor.getText());
      }, debounceMs);
    },
  });

  // Flush any pending debounce on unmount so a switch-away doesn't lose
  // the last keystroke.
  useEffect(() => {
    return () => {
      if (debounceRef.current && editor) {
        clearTimeout(debounceRef.current);
        onChangeRef.current(editor.getHTML());
      }
    };
  }, [editor]);

  // Sync external value changes back into the editor (e.g., undo/redo from
  // outside, locale switch, etc.). Skip if the value matches what the editor
  // already holds to avoid stomping mid-edit.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const colorBtnRef = useRef<HTMLButtonElement>(null);
  const [colorOpen, setColorOpen] = useState(false);
  // Selection captured when the color popover opens. Clicks inside the
  // popover steal focus from the editor, which collapses the visual
  // selection — but the saved range lets us re-target the right text
  // when applying the color.
  const savedRangeRef = useRef<{ from: number; to: number } | null>(null);
  // Whether the saved selection actually spans any text. When false, the
  // toolbar color button acts as a base-color picker (applies to the whole
  // element + strips per-span colors) instead of a per-selection picker.
  const savedHasSelectionRef = useRef(false);
  const selectionColor = editor?.getAttributes('textStyle')?.color as string | undefined;
  // Swatch under the color button: prefer the selection's color, fall back
  // to baseColor so the button reflects what a click would actually change.
  const currentColor = selectionColor ?? baseColor ?? '#ffffff';

  const openColorPicker = () => {
    if (editor) {
      const { from, to } = editor.state.selection;
      savedRangeRef.current = { from, to };
      savedHasSelectionRef.current = from !== to;
    }
    setColorOpen(true);
  };

  const applyColorInstant = (hex: string) => {
    if (!editor) return;
    if (savedHasSelectionRef.current && savedRangeRef.current) {
      // Per-selection color preview — Tiptap's setColor pushes into the
      // editor state, which we debounce before persisting upstream.
      editor
        .chain()
        .focus()
        .setTextSelection(savedRangeRef.current)
        .setColor(hex)
        .run();
      return;
    }
    // Base-color preview — patch the iframe's CSS directly without touching
    // canonical state. The strip-spans pass waits until commit so the
    // editor doesn't get rewritten on every color tick.
    if (onBaseColorInstant) onBaseColorInstant(hex);
  };

  const applyColorCommit = (hex: string) => {
    if (!editor) return;
    if (savedHasSelectionRef.current && savedRangeRef.current) {
      editor
        .chain()
        .focus()
        .setTextSelection(savedRangeRef.current)
        .setColor(hex)
        .run();
      return;
    }
    // Base-color commit: strip every per-span color so the new base shows
    // through, then push the new color upstream. The selectAll pass emits
    // an update so the canonical headline HTML stays in sync.
    const cursor = savedRangeRef.current ?? editor.state.selection;
    editor.chain().focus().selectAll().unsetColor().setTextSelection(cursor).run();
    if (onBaseColor) onBaseColor(hex);
  };

  if (!editor) return null;

  return (
    <div className="mb-3">
      {label && <div className="block text-xs text-text-dim mb-1.5">{label}</div>}
      <div className="input-shell w-full p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-border/40">
          <ToolbarButton
            isActive={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="Bold"
          >
            <span className="text-[13px] leading-none font-black" aria-hidden>B</span>
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="Italic"
          >
            <span
              className="text-[13px] leading-none italic font-semibold"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              aria-hidden
            >
              I
            </span>
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            label="Underline"
          >
            <span
              className="text-[13px] leading-none font-semibold"
              style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
              aria-hidden
            >
              U
            </span>
          </ToolbarButton>

          {/* Color picker trigger */}
          <button
            ref={colorBtnRef}
            type="button"
            className={`${TOOLBAR_BTN} relative`}
            onMouseDown={(e) => {
              e.preventDefault();
              if (colorOpen) {
                setColorOpen(false);
              } else {
                openColorPicker();
              }
            }}
            title="Text color (selected text, or whole element if nothing is selected)"
            aria-label="Text color"
            aria-haspopup="dialog"
            aria-expanded={colorOpen}
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor" aria-hidden>
              <path d="M8 2.5L4.5 11h1.4l.7-2h3.8l.7 2h1.4L8 2.5zm-.9 5L8 4.7l.9 2.8H7.1z" />
            </svg>
            <span
              className="absolute bottom-0.5 left-1.5 right-1.5 h-[3px] rounded-full pointer-events-none"
              style={{ background: currentColor }}
              aria-hidden
            />
          </button>

          <div className="w-px h-4 bg-border/40 mx-1" aria-hidden />

          {/* Alignment */}
          <ToolbarButton
            isActive={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            label="Align left"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <line x1="3" y1="5" x2="13" y2="5" />
              <line x1="3" y1="8" x2="9" y2="8" />
              <line x1="3" y1="11" x2="11" y2="11" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            label="Align center"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <line x1="3" y1="5" x2="13" y2="5" />
              <line x1="5" y1="8" x2="11" y2="8" />
              <line x1="4" y1="11" x2="12" y2="11" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            label="Align right"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <line x1="3" y1="5" x2="13" y2="5" />
              <line x1="7" y1="8" x2="13" y2="8" />
              <line x1="5" y1="11" x2="13" y2="11" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Editor body */}
        <div
          className="rich-text-body px-3 py-2 text-[13px] text-text"
          style={{ minHeight }}
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} placeholder={placeholder} />
        </div>
      </div>

      {colorOpen && colorBtnRef.current && (
        <ColorPickerPopover
          triggerRef={colorBtnRef}
          value={currentColor}
          onChange={applyColorCommit}
          onInstant={applyColorInstant}
          onClose={() => setColorOpen(false)}
        />
      )}
    </div>
  );
}

// Helper: extract plain text from rich HTML. Useful when other systems (CLI
// YAML, export naming, etc.) need the plain version alongside the rich one.
export function richTextToPlain(html: string): string {
  if (typeof DOMParser === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent ?? '';
}

// Helper: detect whether a string looks like rich HTML (contains an html tag)
// vs plain text. Used to decide if backward-compat plain text needs escaping
// vs rich HTML can be rendered as-is.
export function isRichHtml(value: string | null | undefined): value is string {
  if (!value) return false;
  return /<[a-z][\s\S]*>/i.test(value);
}

// Tiptap editor instance type re-export for consumers that need it.
export type { Editor };
