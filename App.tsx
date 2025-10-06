import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SalesPipeline } from './components/SalesPipeline';
import { Customers } from './components/Customers';
import { Marketing } from './components/Marketing';
import { Support } from './components/Support';
import { Tasks } from './components/Tasks';
import { CallCenter } from './components/CallCenter';
import { MediaLibrary } from './components/MediaLibrary';
import { Settings } from './components/Settings';
import { UserManagement } from './components/UserManagement';
import { LandingPages } from './components/LandingPages';
import { LandingPageEditor } from './components/LandingPageEditor';
import { useLocalization } from './hooks/useLocalization';
import type { Page, LandingPage } from './types';
import { mockLandingPages } from './data/mockData';


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { language } = useLocalization();

  const [landingPages, setLandingPages] = useState<LandingPage[]>(mockLandingPages);
  const [isLpEditorOpen, setIsLpEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | 'new' | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'font-arabic bg-maryon-background text-maryon-text-primary' : 'font-sans bg-maryon-background text-maryon-text-primary';
  }, [language]);
  
  const handleEditLandingPage = (page: LandingPage) => {
    setEditingPage(page);
    setIsLpEditorOpen(true);
  };

  const handleCreateLandingPage = () => {
    setEditingPage('new');
    setIsLpEditorOpen(true);
  };

  const handleCloseLpEditor = () => {
    setIsLpEditorOpen(false);
    setEditingPage(null);
  };
  
  const handleSaveLandingPage = (pageData: LandingPage) => {
    if (editingPage !== 'new' && editingPage?.id === pageData.id) {
        setLandingPages(current => current.map(p => p.id === pageData.id ? pageData : p));
    } else {
        const newPage = { ...pageData, id: `LP${(landingPages.length + 1).toString().padStart(3, '0')}` };
        setLandingPages(current => [newPage, ...current]);
    }
    handleCloseLpEditor();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <SalesPipeline />;
      case 'customers':
        return <Customers />;
      case 'marketing':
        return <Marketing />;
      case 'landing-pages':
        return <LandingPages 
                  pages={landingPages} 
                  setPages={setLandingPages}
                  onEdit={handleEditLandingPage} 
                  onCreate={handleCreateLandingPage} 
               />;
      case 'support':
        return <Support />;
      case 'tasks':
        return <Tasks />;
      case 'call-center':
        return <CallCenter />;
      case 'media':
        return <MediaLibrary />;
      case 'settings':
        return <Settings />;
      case 'user-management':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (isLpEditorOpen) {
    return <LandingPageEditor 
              page={editingPage} 
              onSave={handleSaveLandingPage} 
              onClose={handleCloseLpEditor} 
           />;
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;