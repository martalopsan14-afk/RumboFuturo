import { useEffect } from 'react';
import { Instagram } from 'lucide-react';
import type { LegalDocument } from '@/data/legal';
import { Button } from '@/components/ui/Button';

interface LegalDialogProps {
  document: LegalDocument | null;
  onClose: () => void;
}

export function LegalDialog({ document, onClose }: LegalDialogProps) {
  useEffect(() => {
    if (!document) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document, onClose]);

  if (!document) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 animate-fade-up"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-dialog-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-ivory p-8 text-graphite shadow-2xl"
      >
        <h3 id="legal-dialog-title" className="font-sans text-xl text-ink">
          {document.title}
        </h3>
        <p className="mt-4 leading-relaxed">{document.body}</p>
        {document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex font-sans text-sm font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4"
          >
            Abrir documento
          </a>
        )}
        <div className="mt-8 flex justify-end">
          <Button variant="secondary" onClick={onClose} autoFocus>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
