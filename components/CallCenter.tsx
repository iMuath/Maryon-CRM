import React, { useMemo } from 'react';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Phone, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { useLocalization } from '../hooks/useLocalization';
import { mockCallLogs } from '../data/mockData';
import type { CallLog } from '../types';

const CallTypeIcon: React.FC<{ type: CallLog['type'] }> = ({ type }) => {
    switch (type) {
        case 'Incoming':
            return <PhoneIncoming className="w-4 h-4 text-green-500" />;
        case 'Outgoing':
            return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
        case 'Missed':
            return <PhoneMissed className="w-4 h-4 text-red-500" />;
        default:
            return null;
    }
};

const KpiCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => {
    return (
        <Card className="flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-maryon-text-secondary">{title}</h3>
                <Icon className="w-5 h-5 text-maryon-text-muted" />
            </div>
            <p className="mt-4 text-3xl font-bold text-maryon-text-primary">{value}</p>
        </Card>
    );
};


export const CallCenter: React.FC = () => {
    const { t } = useLocalization();
    
    const kpiData = useMemo(() => {
        const totalCalls = mockCallLogs.length;
        const missedCalls = mockCallLogs.filter(log => log.type === 'Missed').length;

        const totalSeconds = mockCallLogs.reduce((acc, log) => {
            const [minutes, seconds] = log.duration.split(':').map(Number);
            return acc + (minutes * 60) + seconds;
        }, 0);

        const avgSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
        const avgMinutes = Math.floor(avgSeconds / 60);
        const remainingSeconds = avgSeconds % 60;
        const avgDuration = `${avgMinutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;

        return { totalCalls, missedCalls, avgDuration };
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <KpiCard title={t('total_calls')} value={String(kpiData.totalCalls)} icon={Phone} />
                 <KpiCard title={t('avg_call_duration')} value={kpiData.avgDuration} icon={Clock} />
                 <KpiCard title={t('missed_calls')} value={String(kpiData.missedCalls)} icon={PhoneMissed} />
            </div>

            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-maryon-text-primary">{t('call_logs')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-start text-maryon-text-secondary">
                        <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                            <tr>
                                <th scope="col" className="px-6 py-3">{t('caller')}</th>
                                <th scope="col" className="px-6 py-3">{t('phone_number')}</th>
                                <th scope="col" className="px-6 py-3">{t('type')}</th>
                                <th scope="col" className="px-6 py-3">{t('duration')}</th>
                                <th scope="col" className="px-6 py-3">{t('timestamp')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockCallLogs.map((log) => (
                                <tr key={log.id} className="border-b border-maryon-border hover:bg-maryon-hover">
                                    <th scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap">
                                        {log.callerName}
                                    </th>
                                    <td className="px-6 py-4">{log.phoneNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CallTypeIcon type={log.type} />
                                            <span>{log.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{log.duration}</td>
                                    <td className="px-6 py-4">{log.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};