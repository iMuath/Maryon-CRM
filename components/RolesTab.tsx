import React from 'react';
import { Card } from './ui/Card';
import { useLocalization } from '../hooks/useLocalization';
import { mockRoles } from '../data/mockData';
import type { UserRole } from '../types';

const RoleCard: React.FC<{ role: UserRole }> = ({ role }) => {
    const { t } = useLocalization();
    const modules = Object.keys(role.permissions);

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <Card className="flex flex-col">
            <h3 className="text-lg font-bold text-maryon-text-primary">{role.name}</h3>
            <p className="text-sm text-maryon-text-secondary mb-4">{role.description}</p>
            
            <div className="overflow-x-auto -mx-6 -mb-6">
                <table className="w-full text-sm">
                    <thead className="bg-maryon-hover">
                        <tr>
                            <th className="px-4 py-2 text-start font-semibold text-maryon-text-secondary">{t('module')}</th>
                            <th className="px-4 py-2 text-start font-semibold text-maryon-text-secondary">{t('permissions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map(moduleKey => {
                            const perms = role.permissions[moduleKey as keyof typeof role.permissions];
                            const permList = Object.entries(perms)
                                .filter(([, value]) => value === true)
                                .map(([key]) => key.replace(/([A-Z])/g, ' $1'));

                            return (
                                <tr key={moduleKey} className="border-t border-maryon-border">
                                    <td className="px-4 py-3 font-medium capitalize text-maryon-text-primary">{moduleKey.replace(/([A-Z])/g, ' $1')}</td>
                                    <td className="px-4 py-3">
                                        {permList.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {permList.map(p => (
                                                    <span key={p} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">{capitalize(p)}</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-maryon-text-muted">No Permissions</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const RolesTab: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-maryon-text-primary">{t('roles')}</h2>
                <p className="text-sm text-maryon-text-secondary mt-1">Review the permissions for each role in the system.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockRoles.map(role => (
                    <RoleCard key={role.id} role={role} />
                ))}
            </div>
        </div>
    );
};