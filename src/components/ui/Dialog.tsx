'use client';
import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name (visible heading preferred; falls back to aria-label). */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * Modal built on the native <dialog>. The browser provides the focus trap, Escape handling, inert background
 * and focus return; we add scroll lock and click-on-backdrop close. Always include a visible close button.
 */
export function Dialog({ open, onClose, label, className, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.classList.add('is-locked');
    } else if (!open && el.open) {
      el.close();
    }
    return () => {
      document.documentElement.classList.remove('is-locked');
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={className}
      onClose={() => {
        document.documentElement.classList.remove('is-locked');
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click landed on the backdrop, not the content
      }}
    >
      {open ? children : null}
    </dialog>
  );
}
