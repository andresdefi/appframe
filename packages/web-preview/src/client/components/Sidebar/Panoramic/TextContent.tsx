import { usePreviewStore } from '../../../store';
import { Section } from '../../Controls/Section';
import { ElementInspector } from './ElementInspector';
import { ELEMENT_TYPE_LABELS } from './helpers';

export function PanoramicTextContent() {
  const elements = usePreviewStore((s) => s.panoramicElements);
  const selectedElementIndex = usePreviewStore((s) => s.selectedElementIndex);
  const setSelectedElement = usePreviewStore((s) => s.setSelectedElement);
  const addElement = usePreviewStore((s) => s.addPanoramicElement);

  const filtered = elements
    .map((el, i) => ({ el, i }))
    .filter(
      ({ el }) =>
        el.type === 'text' ||
        el.type === 'label' ||
        el.type === 'card' ||
        el.type === 'badge' ||
        el.type === 'proof-chip',
    );

  const addText = () => {
    const textCount = elements.filter((e) => e.type === 'text').length;
    addElement({
      type: 'text',
      content: 'New headline',
      x: 5 + textCount * 20,
      y: 5,
      fontSize: 3.5,
      color: '#FFFFFF',
      fontWeight: 700,
      fontStyle: 'normal',
      textAlign: 'left',
      lineHeight: 1.15,
      letterSpacing: 0,
      textTransform: '',
      rotation: 0,
      maxWidth: 25,
      z: 10,
    });
  };

  const addLabel = () => {
    addElement({
      type: 'label',
      content: 'New Label',
      x: 50,
      y: 50,
      fontSize: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#00000044',
      padding: 0.5,
      borderRadius: 8,
      z: 15,
    });
  };

  const addCard = () => {
    const cardCount = elements.filter((e) => e.type === 'card').length;
    addElement({
      type: 'card',
      x: 8 + cardCount * 12,
      y: 62,
      width: 18,
      height: 18,
      eyebrow: 'Highlight',
      title: 'Support detail',
      body: 'Use short proof or context here.',
      align: 'left',
      backgroundColor: '#FFFFFF',
      opacity: 0.96,
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 28,
      padding: 2.2,
      rotation: 0,
      eyebrowColor: '#64748B',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      eyebrowSize: 1.1,
      titleSize: 2.2,
      bodySize: 1.3,
      z: 9,
    });
  };

  const addBadge = () => {
    const badgeCount = elements.filter((e) => e.type === 'badge').length;
    addElement({
      type: 'badge',
      content: 'New badge',
      x: 8 + badgeCount * 12,
      y: 18,
      width: 16,
      height: 5,
      color: '#0F172A',
      backgroundColor: '#FFFFFF',
      opacity: 0.96,
      borderColor: '#CBD5E1',
      borderWidth: 1,
      borderRadius: 100,
      fontSize: 1.1,
      fontWeight: 700,
      letterSpacing: 12,
      textTransform: 'uppercase',
      rotation: 0,
      z: 12,
    });
  };

  const addProofChip = () => {
    const proofCount = elements.filter((e) => e.type === 'proof-chip').length;
    addElement({
      type: 'proof-chip',
      value: '4.9 out of 5',
      detail: 'App Store rating',
      rating: 5,
      maxRating: 5,
      x: 8 + proofCount * 14,
      y: 24,
      width: 18,
      height: 9,
      color: '#0F172A',
      mutedColor: '#64748B',
      starColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      opacity: 0.98,
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 28,
      valueSize: 1.8,
      detailSize: 1,
      padding: 1.4,
      rotation: 0,
      z: 11,
    });
  };

  const showInspector =
    selectedElementIndex !== null &&
    elements[selectedElementIndex] &&
    (elements[selectedElementIndex]!.type === 'text' ||
      elements[selectedElementIndex]!.type === 'label' ||
      elements[selectedElementIndex]!.type === 'card' ||
      elements[selectedElementIndex]!.type === 'badge' ||
      elements[selectedElementIndex]!.type === 'proof-chip');

  return (
    <div>
      <Section title={`Text & Labels (${filtered.length})`} defaultCollapsed={false}>
        <div className="grid grid-cols-5 gap-1 mb-3">
          <button
            className="btn-secondary text-[11px]"
            onClick={addText}
          >
            + Text
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addLabel}
          >
            + Label
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addCard}
          >
            + Card
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addBadge}
          >
            + Badge
          </button>
          <button
            className="btn-secondary text-[11px]"
            onClick={addProofChip}
          >
            + Proof
          </button>
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-text-dim text-center py-4">
            Add text elements, labels, badges, proof chips, and support cards.
          </p>
        )}
        <div className="space-y-1">
          {filtered.map(({ el, i }) => {
            const typeNum = elements.slice(0, i).filter((e) => e.type === el.type).length + 1;
            return (
              <button
                key={i}
                className={`w-full text-left text-xs px-2.5 py-2 rounded-md transition-colors ${
                  i === selectedElementIndex
                    ? 'bg-accent/15 text-accent border border-accent/30'
                    : 'bg-surface-2 border border-border hover:border-accent/30'
                }`}
                onClick={() => setSelectedElement(i === selectedElementIndex ? null : i)}
              >
                <span className="font-medium">
                  {ELEMENT_TYPE_LABELS[el.type]} #{typeNum}
                </span>
                <span className="text-text-dim ml-1">
                  ({Math.round(el.x)}%, {Math.round(el.y)}%)
                </span>
                {(el.type === 'text' || el.type === 'label' || el.type === 'badge') && (
                  <span
                    className="text-text-dim ml-1 truncate"
                    title={(el as { content: string }).content}
                  >
                    &mdash; {(el as { content: string }).content.slice(0, 20)}
                  </span>
                )}
                {el.type === 'proof-chip' && (
                  <span className="text-text-dim ml-1 truncate" title={el.value}>
                    &mdash; {el.value.slice(0, 20)}
                  </span>
                )}
                {el.type === 'card' && (
                  <span
                    className="text-text-dim ml-1 truncate"
                    title={(el.title ?? el.body ?? '').toString()}
                  >
                    &mdash; {(el.title ?? el.body ?? 'Card').slice(0, 20)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {showInspector && <ElementInspector index={selectedElementIndex!} />}
    </div>
  );
}
