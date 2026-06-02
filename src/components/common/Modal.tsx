import type { ReactNode } from "react";
import Button from "@/components/common/Button";

interface ModalProps {
  children: ReactNode;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export default function Modal({ children, description, onClose, open, title }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm animate-fade-in">
      <section
        aria-modal="true"
        className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20 animate-slide-up"
        role="dialog"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <Button aria-label="Close modal" className="h-10 w-10 px-0" onClick={onClose} variant="ghost">
            <span className="text-xl leading-none">x</span>
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}