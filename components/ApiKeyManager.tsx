import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { PlusCircle, Trash2, Copy } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import { mockApiKeys } from '../data/mockData';
import type { ApiKey } from '../types';

export const ApiKeyManager: React.FC = () => {
    const { t } = useLocalization();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
    const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const maskKey = (key: string) => `${key.substring(0, 11)}...${key.substring(key.length - 4)}`;

    const handleGenerateKey = () => {
        const newKey = `maryon_sk_live_${[...Array(32)].map(() => Math.random().toString(36)[2]).join('')}`;
        const newApiKey: ApiKey = {
            id: `ak_${apiKeys.length + 1}`,
            key: newKey,
            createdAt: new Date().toISOString().split('T')[0],
            lastUsed: 'Never',
        };
        setApiKeys(prevKeys => [newApiKey, ...prevKeys]);
    };

    const handleRevokeClick = (key: ApiKey) => {
        setKeyToRevoke(key);
    };

    const handleConfirmRevoke = () => {
        if (keyToRevoke) {
            setApiKeys(currentKeys => currentKeys.filter(k => k.id !== keyToRevoke.id));
            setKeyToRevoke(null);
        }
    };
    
    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    }

    return (
        <>
            <Card>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-maryon-text-primary">{t('api_keys')}</h2>
                        <p className="text-sm text-maryon-text-secondary mt-1">{t('api_keys_desc')}</p>
                    </div>
                    <Button onClick={handleGenerateKey} className="flex-shrink-0">
                        <PlusCircle className="w-5 h-5 me-2" />
                        {t('generate_new_key')}
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start text-maryon-text-secondary">
                        <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('key')}</th>
                                <th scope="col" className="px-6 py-3">{t('created_at')}</th>
                                <th scope="col" className="px-6 py-3">{t('last_used')}</th>
                                <th scope="col" className="px-6 py-3 text-end">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((apiKey) => (
                                <tr key={apiKey.id} className="border-b border-maryon-border hover:bg-maryon-hover">
                                    <td className="px-6 py-4 font-mono text-maryon-text-primary flex items-center gap-2">
                                        <span>{maskKey(apiKey.key)}</span>
                                        <button onClick={() => handleCopy(apiKey.key)} className="p-1.5 rounded-md hover:bg-maryon-border text-maryon-text-muted hover:text-maryon-text-primary">
                                            {copiedKey === apiKey.key ? t('copied') : <Copy className="w-4 h-4" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">{apiKey.createdAt}</td>
                                    <td className="px-6 py-4">{apiKey.lastUsed}</td>
                                    <td className="px-6 py-4 text-end">
                                        <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleRevokeClick(apiKey)}>
                                            <Trash2 className="w-4 h-4 me-2" />
                                            {t('revoke')}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={!!keyToRevoke}
                onClose={() => setKeyToRevoke(null)}
                title={t('revoke_key_title')}
            >
                <div className="text-center">
                    <p className="text-maryon-text-secondary mb-6">{t('revoke_key_confirm')}</p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                        <Button onClick={() => setKeyToRevoke(null)} variant="secondary">
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={handleConfirmRevoke}
                            variant="primary"
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            {t('revoke')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
