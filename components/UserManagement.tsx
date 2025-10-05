import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { UsersTab } from './UsersTab';
import { RolesTab } from './RolesTab';

type UserManagementTab = 'users' | 'roles';

export const UserManagement: React.FC = () => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState<UserManagementTab>('users');
    
    const tabs = [
        { id: 'users' as UserManagementTab, label: t('users') },
        { id: 'roles' as UserManagementTab, label: t('roles') },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-maryon-text-primary">{t('user_management')}</h1>
            
            <div className="border-b border-maryon-border">
                <nav className="-mb-px flex space-x-6 rtl:space-x-reverse" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                ? 'border-maryon-accent text-maryon-accent'
                                : 'border-transparent text-maryon-text-secondary hover:text-maryon-text-primary hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'roles' && <RolesTab />}
            </div>
        </div>
    );
};