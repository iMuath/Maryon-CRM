import React from 'react';
import type { LandingPage } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from './ui/Button';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface LandingPageCardProps {
  page: LandingPage;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

const PagePreview: React.FC<{ page: LandingPage }> = ({ page }) => {
    const heroBlock = page.content.find(block => block.type === 'hero');
    if (heroBlock && heroBlock.type === 'hero') {
        return (
            <div className="relative w-full h-full overflow-hidden">
                <img src={heroBlock.imageUrl} alt={page.title} className="absolute inset-0 object-cover w-full h-full blur-sm scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative p-4 flex flex-col justify-center items-center h-full text-center">
                    <h4 className="font-bold text-white text-lg drop-shadow-md">{heroBlock.title}</h4>
                    <p className="text-sm text-gray-200 drop-shadow-md">{heroBlock.subtitle}</p>
                </div>
            </div>
        )
    }
    return <div className="flex items-center justify-center h-full text-maryon-text-muted">{page.title}</div>
}


export const LandingPageCard: React.FC<LandingPageCardProps> = ({ page, onEdit, onDelete, onPreview }) => {
  const { t } = useLocalization();

  const statusColors = {
    'Published': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="relative group overflow-hidden rounded-lg border border-maryon-border bg-maryon-surface transition-shadow hover:shadow-xl">
      <div className="h-48 bg-maryon-hover">
        <PagePreview page={page} />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-maryon-text-primary truncate">{page.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[page.status]}`}>
            {t(page.status.toLowerCase())}
          </span>
          <p className="text-xs text-maryon-text-secondary">{page.createdAt}</p>
        </div>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
        <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={onPreview}>
          <Eye className="w-4 h-4 me-1" />
          {t('preview')}
        </Button>
        <Button variant="secondary" className="p-2" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-500" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};