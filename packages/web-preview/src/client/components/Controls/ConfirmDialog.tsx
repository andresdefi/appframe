import { useEffect, useRef, useCallback } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
    if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onCancel]);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        aria-describedby="confirm-dialog-message"
        className="bg-surface surface-card rounded-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-text mb-2 text-balance">{title}</h3>
        <p id="confirm-dialog-message" className="text-xs text-text-dim mb-5 leading-relaxed text-pretty">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            ref={cancelRef}
            className="btn-secondary text-xs"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          {destructive ? (
            <button
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-[13px] bg-red-500 text-white hover:bg-red-600 transition active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow-md"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          ) : (
            <button
              className="btn-primary text-xs"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for using confirm dialog imperatively
import { useState } from 'react';

interface UseConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
}

export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    options: UseConfirmOptions;
    resolve: ((confirmed: boolean) => void) | null;
  }>({
    open: false,
    options: { title: '', message: '' },
    resolve: null,
  });

  const confirm = useCallback((options: UseConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, [state.resolve]);

  const dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.options.title}
      message={state.options.message}
      confirmLabel={state.options.confirmLabel}
      destructive={state.options.destructive}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, dialog };
}
