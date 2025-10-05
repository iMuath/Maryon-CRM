import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { InviteUserForm } from './InviteUserForm';
import { PlusCircle } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import { mockSystemUsers, mockRoles } from '../data/mockData';
import type { SystemUser } from '../types';

export const UsersTab: React.FC = () => {
    const { t } = useLocalization();
    const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const statusColors: Record<SystemUser['status'], string> = {
        'Active': 'bg-green-100 text-green-800',
        'Invited': 'bg-blue-100 text-blue-800',
        'Inactive': 'bg-gray-100 text-gray-800',
    };
    
    const handleInviteUser = (userData: Omit<SystemUser, 'id' | 'status'>) => {
        const newUser: SystemUser = {
            ...userData,
            id: `user_${(users.length + 1).toString().padStart(3, '0')}`,
            status: 'Invited',
        };
        setUsers(prev => [newUser, ...prev]);
        setIsModalOpen(false);
    };
    
    const getRoleName = (roleId: string) => mockRoles.find(r => r.id === roleId)?.name || 'Unknown Role';

    return (
        <>
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-maryon-text-primary">{t('all_users')}</h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusCircle className="w-5 h-5 me-2" />
                        {t('invite_user')}
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start text-maryon-text-secondary">
                        <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('user')}</th>
                                <th scope="col" className="px-6 py-3">{t('role')}</th>
                                <th scope="col" className="px-6 py-3">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-maryon-border hover:bg-maryon-hover">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-maryon-text-primary">{user.name}</div>
                                        <div className="text-maryon-text-muted">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{getRoleName(user.roleId)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status]}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t('invite_new_user')}
            >
                <InviteUserForm
                    onSave={handleInviteUser}
                    onCancel={() => setIsModalOpen(false)}
                    roles={mockRoles}
                />
            </Modal>
        </>
    );
};