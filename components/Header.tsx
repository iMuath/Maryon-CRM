import React from 'react';
import { Search, Bell, Globe } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  return (
    <header className="flex-shrink-0 bg-maryon-surface border-b border-maryon-border">
      <div className="flex items-center justify-between p-4 h-20">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-5 h-5 text-maryon-text-muted" />
          </div>
          <input
            type="text"
            placeholder={t('search')}
            className="w-full bg-maryon-background border border-maryon-border text-maryon-text-primary rounded-lg block ps-10 p-2.5 focus:ring-maryon-accent focus:border-maryon-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-maryon-hover text-maryon-text-secondary hover:text-maryon-text-primary transition-colors">
            <Globe className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full hover:bg-maryon-hover text-maryon-text-secondary hover:text-maryon-text-primary transition-colors">
            <Bell className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img className="w-10 h-10 rounded-full" src="https://picsum.photos/100/100" alt="User" />
            <div className="hidden md:block text-end">
              <p className="font-semibold text-maryon-text-primary">Admin User</p>
              <p className="text-sm text-maryon-text-secondary">IT Staff</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};