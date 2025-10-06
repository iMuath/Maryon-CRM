import React from 'react';
import { LayoutDashboard, Users, BarChart2, Megaphone, LifeBuoy, Settings, LogOut, Briefcase, CheckSquare, Phone, Image } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import type { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const MaryonLogo: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 250 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="30" dominantBaseline="middle" textAnchor="middle" fontSize="30" fontFamily="serif" fontStyle="italic">
            maryon
        </text>
        <text x="50%" y="70" dominantBaseline="middle" textAnchor="middle" fontSize="30" fontFamily="Tajawal, sans-serif">
            ماريون
        </text>
    </svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useLocalization();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, page: 'dashboard' as Page },
    { id: 'sales', label: t('sales_pipeline'), icon: BarChart2, page: 'sales' as Page },
    { id: 'customers', label: t('customers'), icon: Users, page: 'customers' as Page },
    { id: 'marketing', label: t('marketing'), icon: Megaphone, page: 'marketing' as Page },
    { id: 'landing-pages', label: t('landing_pages'), icon: Briefcase, page: 'landing-pages' as Page },
    { id: 'support', label: t('support'), icon: LifeBuoy, page: 'support' as Page },
    { id: 'tasks', label: t('tasks'), icon: CheckSquare, page: 'tasks' as Page },
    { id: 'call-center', label: t('call_center'), icon: Phone, page: 'call-center' as Page },
    { id: 'media', label: t('media'), icon: Image, page: 'media' as Page },
  ];
  
  const bottomNavItems = [
      { id: 'user-management', label: t('user_management'), icon: Users, page: 'user-management' as Page },
      { id: 'settings', label: t('settings'), icon: Settings, page: 'settings' as Page },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 bg-maryon-surface border-e border-maryon-border">
      <div className="flex items-center justify-center h-20 border-b border-maryon-border text-maryon-text-primary">
        <MaryonLogo className="h-12 w-auto" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.page);
              }}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors
                ${currentPage === item.page
                  ? 'bg-maryon-hover text-maryon-text-primary font-semibold'
                  : 'text-maryon-text-secondary hover:bg-maryon-hover hover:text-maryon-text-primary'
                }`}
            >
              <item.icon className="w-5 h-5 me-3" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
       <div className="p-4 border-t border-maryon-border">
        {bottomNavItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.page);
              }}
              className={`flex items-center px-4 py-2.5 rounded-lg transition-colors mb-2
                ${currentPage === item.page
                  ? 'bg-maryon-hover text-maryon-text-primary font-semibold'
                  : 'text-maryon-text-secondary hover:bg-maryon-hover hover:text-maryon-text-primary'
                }`}
            >
              <item.icon className="w-5 h-5 me-3" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
         <a href="#" className="flex items-center px-4 py-2.5 rounded-lg text-maryon-text-secondary hover:bg-maryon-hover hover:text-maryon-text-primary">
            <LogOut className="w-5 h-5 me-3" />
            <span>{t('logout')}</span>
        </a>
       </div>
    </div>
  );
};