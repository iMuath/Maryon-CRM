import React from 'react';
import { Card } from './ui/Card';
import { useLocalization } from '../hooks/useLocalization';
import { mockTickets } from '../data/mockData';
import { Button } from './ui/Button';

export const Support: React.FC = () => {
    const { t } = useLocalization();

    const statusColors = {
        'Open': 'bg-green-100 text-green-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        'Resolved': 'bg-blue-100 text-blue-800',
        'Closed': 'bg-gray-100 text-gray-800',
    };

    const priorityColors = {
        'High': 'text-red-600',
        'Medium': 'text-yellow-600',
        'Low': 'text-green-600',
    };

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-maryon-text-primary">{t('support_dashboard')}</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start text-maryon-text-secondary">
                    <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('subject')}</th>
                            <th scope="col" className="px-6 py-3">{t('customers')}</th>
                            <th scope="col" className="px-6 py-3">{t('status')}</th>
                            <th scope="col" className="px-6 py-3">{t('priority')}</th>
                            <th scope="col" className="px-6 py-3">{t('assigned_to')}</th>
                            <th scope="col" className="px-6 py-3">{t('created_at')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTickets.map((ticket) => (
                            <tr key={ticket.id} className="border-b border-maryon-border hover:bg-maryon-hover">
                                <th scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap">
                                    {ticket.subject}
                                </th>
                                <td className="px-6 py-4">{ticket.customerName}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${priorityColors[ticket.priority]}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{ticket.assignedTo}</td>
                                <td className="px-6 py-4">{ticket.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};