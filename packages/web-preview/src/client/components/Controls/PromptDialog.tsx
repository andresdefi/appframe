import { useCallback, useEffect, useRef, useState } from 'react';

interface PromptDialogProps {
  open: boolean;
  title: string;
  label?: string;
  message?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({
  open,
  title,
  label,
  message,
  defaultValue = '',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  placeholder,
  onSubmit,
  onCancel,
}: PromptDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);

  // Reset the field each time the dialog opens. Without this a second
  // open would inherit whatever the user typed into the previous one.
  useEffect(() => {
    if (open) {
      setValue(defaultValue);
      // Defer focus until after the dialog mounts so the input lands
      // selected for fast retype.
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [open, defaultValue]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface surface-card rounded-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-text mb-2 text-balance">{title}</h3>
        {message && (
          <p className="text-xs text-text-dim mb-3 leading-relaxed text-pretty">{message}</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {label && (
            <label className="block text-[11px] text-text-dim mb-1.5 font-medium">{label}</label>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
            autoComplete="off"
          />
          <div className="flex gap-2 justify-end mt-5">
            <button type="button" className="btn-secondary text-xs" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="submit" className="btn-primary text-xs" disabled={!value.trim()}>
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface UsePromptOptions {
  title: string;
  label?: string;
  message?: string;
  defaultValue?: string;
  confirmLabel?: string;
  placeholder?: string;
}

interface PromptState {
  open: boolean;
  options: UsePromptOptions;
  resolve: ((value: string | null) => void) | null;
}

// Hook companion to useConfirmDialog. Resolves to the entered value
// (trimmed) on submit, or null on cancel. Designed for the same call
// shape as `await prompt({...})` so it slots straight in where
// window.prompt used to live.
export function usePromptDialog() {
  const [state, setState] = useState<PromptState>({
    open: false,
    options: { title: '' },
    resolve: null,
  });

  const prompt = useCallback((options: UsePromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleSubmit = useCallback(
    (value: string) => {
      state.resolve?.(value);
      setState((s) => ({ ...s, open: false, resolve: null }));
    },
    [state.resolve],
  );

  const handleCancel = useCallback(() => {
    state.resolve?.(null);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, [state.resolve]);

  const dialog = (
    <PromptDialog
      open={state.open}
      title={state.options.title}
      label={state.options.label}
      message={state.options.message}
      defaultValue={state.options.defaultValue}
      confirmLabel={state.options.confirmLabel}
      placeholder={state.options.placeholder}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );

  return { prompt, dialog };
}
