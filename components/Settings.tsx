import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from './ui/Card';
import { ApiKeyManager } from './ApiKeyManager';
import { ApiDocumentation } from './ApiDocumentation';
import { Key, Book } from 'lucide-react';

type SettingsTab = 'keys' | 'docs';

export const Settings: React.FC = () => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState<SettingsTab>('keys');

    const tabs = [
        { id: 'keys' as SettingsTab, label: t('api_keys'), icon: Key },
        { id: 'docs' as SettingsTab, label: t('api_docs'), icon: Book },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'keys':
                return <ApiKeyManager />;
            case 'docs':
                return <ApiDocumentation />;
            default:
                return null;
        }
    };

    const activeTabInfo = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-maryon-text-primary">{t('settings')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">
                {/* Left Navigation */}
                <aside className="md:col-span-1">
                    <nav className="flex flex-col space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2.5 rounded-lg text-start transition-colors w-full
                                    ${activeTab === tab.id
                                        ? 'bg-maryon-hover text-maryon-text-primary font-semibold'
                                        : 'text-maryon-text-secondary hover:bg-maryon-hover hover:text-maryon-text-primary'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5 me-3 flex-shrink-0" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Right Content */}
                <main className="md:col-span-3 lg:col-span-4">
                     {renderContent()}
                </main>
            </div>
        </div>
    );
};
