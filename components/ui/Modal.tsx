import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-maryon-surface border-maryon-border p-0">
          <div className="flex justify-between items-center p-6 border-b border-maryon-border">
            <h3 className="text-xl font-semibold text-maryon-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-maryon-text-muted hover:bg-maryon-hover hover:text-maryon-text-primary transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};