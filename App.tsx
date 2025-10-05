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
import { useLocalization } from './hooks/useLocalization';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { language } = useLocalization();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.className = language === 'ar' ? 'font-arabic bg-maryon-background text-maryon-text-primary' : 'font-sans bg-maryon-background text-maryon-text-primary';
  }, [language]);


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

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;