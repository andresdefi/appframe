interface CollapsiblePanelProps {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}

export function CollapsiblePanel({ title, onRemove, children }: CollapsiblePanelProps) {
  return (
    <div className="border border-border rounded-md p-2 mb-1.5 text-[11px]">
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-semibold text-text-dim">{title}</span>
        <button
          className="text-text-dim hover:text-red-400 text-sm leading-none px-1"
          onClick={onRemove}
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  );
}
