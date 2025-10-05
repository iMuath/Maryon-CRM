import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { SystemUser, UserRole } from '../types';

interface InviteUserFormProps {
  onSave: (user: Omit<SystemUser, 'id' | 'status'>) => void;
  onCancel: () => void;
  roles: UserRole[];
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({ onSave, onCancel, roles }) => {
    const { t } = useLocalization();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState(roles[1]?.id || roles[0]?.id || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, email, roleId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                id="name"
                name="name"
                label={t('name')}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
            <Input
                id="email"
                name="email"
                label={t('email')}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <Select
                id="roleId"
                name="roleId"
                label={t('role')}
                value={roleId}
                onChange={e => setRoleId(e.target.value)}
            >
                {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                ))}
            </Select>
            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    {t('cancel')}
                </Button>
                <Button type="submit" variant="primary">
                    {t('invite_user')}
                </Button>
            </div>
        </form>
    );
};