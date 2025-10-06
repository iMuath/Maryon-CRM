import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from './ui/Button';
import { PlusCircle } from 'lucide-react';
import { LandingPageCard } from './LandingPageCard';
import type { LandingPage } from '../types';

interface LandingPagesProps {
  pages: LandingPage[];
  setPages: React.Dispatch<React.SetStateAction<LandingPage[]>>;
  onCreate: () => void;
  onEdit: (page: LandingPage) => void;
}

export const LandingPages: React.FC<LandingPagesProps> = ({ pages, setPages, onCreate, onEdit }) => {
  const { t } = useLocalization();

  const handleDelete = (id: string) => {
    // In a real app, show a confirmation modal first
    setPages(currentPages => currentPages.filter(p => p.id !== id));
  };
  
  const handlePreview = (page: LandingPage) => {
      // In a real app, this would open a new tab with the rendered page
      alert(`Previewing: ${page.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-maryon-text-primary">{t('landing_pages')}</h1>
        <Button onClick={onCreate}>
          <PlusCircle className="w-5 h-5 me-2" />
          {t('create_page')}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pages.map(page => (
          <LandingPageCard 
            key={page.id} 
            page={page}
            onEdit={() => onEdit(page)}
            onDelete={() => handleDelete(page.id)}
            onPreview={() => handlePreview(page)}
          />
        ))}
      </div>
    </div>
  );
};