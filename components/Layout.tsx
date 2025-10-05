import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  return (
    <div className="flex h-screen bg-maryon-background text-maryon-text-primary">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-maryon-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};