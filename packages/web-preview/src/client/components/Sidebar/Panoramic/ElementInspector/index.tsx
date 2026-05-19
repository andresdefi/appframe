import { usePreviewStore } from '../../../../store';
import { Section } from '../../../Controls/Section';
import { RangeSlider } from '../../../Controls/RangeSlider';
import { useConfirmDialog } from '../../../Controls/ConfirmDialog';
import { ELEMENT_TYPE_LABELS } from '../helpers';
import { useInspectorHandlers } from './useInspectorHandlers';
import { GroupInspector } from './GroupInspector';
import { DeviceInspector } from './DeviceInspector';
import { TextInspector } from './TextInspector';
import { ImageInspector } from './ImageInspector';
import { CropInspector } from './CropInspector';
import { CardInspector } from './CardInspector';
import { BadgeInspector } from './BadgeInspector';
import { ProofChipInspector } from './ProofChipInspector';
import { LabelInspector } from './LabelInspector';
import { DecorationInspector } from './DecorationInspector';

export function ElementInspector({ index }: { index: number }) {
  const { element, update, instant } = useInspectorHandlers(index);
  const elements = usePreviewStore((s) => s.panoramicElements);
  const removeElement = usePreviewStore((s) => s.removePanoramicElement);
  const { confirm, dialog } = useConfirmDialog();

  if (!element) return null;

  return (
    <div>
      {dialog}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium">
          {ELEMENT_TYPE_LABELS[element.type]} #
          {elements.slice(0, index).filter((e) => e.type === element.type).length + 1}
        </span>
        <button
          className="text-[10px] text-red-400 hover:text-red-300"
          onClick={async () => {
            const typeNum =
              elements.slice(0, index).filter((e) => e.type === element.type).length + 1;
            const ok = await confirm({
              title: 'Remove Element',
              message: `Remove ${ELEMENT_TYPE_LABELS[element.type]} #${typeNum}? This cannot be undone.`,
            });
            if (ok) removeElement(index);
          }}
        >
          Remove
        </button>
      </div>

      {/* Position — all element types */}
      <Section title="Position" defaultCollapsed={false}>
        <RangeSlider
          label="X %"
          value={element.x}
          min={-50}
          max={150}
          step={0.5}
          formatValue={(v) => `${v}%`}
          onChange={(v) => update({ x: v })}
          onInstant={(v) => instant({ x: v })}
          resetTo={50}
        />
        <RangeSlider
          label="Y %"
          value={element.y}
          min={-50}
          max={150}
          step={0.5}
          formatValue={(v) => `${v}%`}
          onChange={(v) => update({ y: v })}
          onInstant={(v) => instant({ y: v })}
          resetTo={50}
        />
        <RangeSlider
          label="Z-Index"
          value={element.z}
          min={0}
          max={100}
          onChange={(v) => update({ z: v })}
          resetTo={0}
        />
      </Section>

      {element.type === 'group' && <GroupInspector index={index} />}
      {element.type === 'device' && <DeviceInspector index={index} />}
      {element.type === 'text' && <TextInspector index={index} />}
      {(element.type === 'image' || element.type === 'logo') && <ImageInspector index={index} />}
      {element.type === 'crop' && <CropInspector index={index} />}
      {element.type === 'card' && <CardInspector index={index} />}
      {element.type === 'badge' && <BadgeInspector index={index} />}
      {element.type === 'proof-chip' && <ProofChipInspector index={index} />}
      {element.type === 'label' && <LabelInspector index={index} />}
      {element.type === 'decoration' && <DecorationInspector index={index} />}
    </div>
  );
}
