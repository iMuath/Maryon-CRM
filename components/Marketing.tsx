import React, { useState } from 'react';
import { Card } from './ui/Card';
import { useLocalization } from '../hooks/useLocalization';
import { mockCampaigns, mockCustomers, mockEmailTemplates } from '../data/mockData';
import { Button } from './ui/Button';
import { Facebook, Instagram, Twitter, Linkedin, MessageSquare, Mail, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { WhatsAppMessageForm } from './WhatsAppMessageForm';
import { EmailTemplateForm } from './EmailTemplateForm';
import type { EmailTemplate } from '../types';

export const Marketing: React.FC = () => {
    const { t } = useLocalization();
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
    const [isEmailConnected, setIsEmailConnected] = useState(false);

    const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

    const statusColors: { [key: string]: string } = {
        'Active': 'bg-green-100 text-green-800',
        'Planning': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-gray-100 text-gray-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };
    
    const handleSendMessage = (data: {recipient: string, message: string}) => {
        console.log("Sending WhatsApp Message:", data);
        alert(`Message sent to ${data.recipient}:\n\n"${data.message}"`);
        setIsWhatsAppModalOpen(false);
    }

    const handleOpenTemplateModal = (template: EmailTemplate | null = null) => {
        setSelectedTemplate(template);
        setIsTemplateModalOpen(true);
    };

    const handleCloseTemplateModal = () => {
        setIsTemplateModalOpen(false);
        setSelectedTemplate(null);
    };

    const handleSaveTemplate = (templateData: Omit<EmailTemplate, 'id' | 'thumbnailUrl'> | EmailTemplate) => {
        if ('id' in templateData) {
            setTemplates(templates.map(t => t.id === templateData.id ? { ...t, ...templateData } : t));
        } else {
            const newTemplate: EmailTemplate = {
                ...templateData,
                id: `ET${(templates.length + 1).toString().padStart(3, '0')}`,
                thumbnailUrl: `https://picsum.photos/seed/${templateData.name.replace(/\s/g, '-')}/400/300`,
            };
            setTemplates(prev => [newTemplate, ...prev]);
        }
        handleCloseTemplateModal();
    };
    
    const handleDeleteTemplate = (id: string) => {
        setTemplates(current => current.filter(t => t.id !== id));
    };

    return (
        <>
            <div className="space-y-8">
                <Card>
                    <h2 className="text-xl font-semibold text-maryon-text-primary mb-6">{t('integrations')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Social Media */}
                        <div className="bg-maryon-background border border-maryon-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-maryon-text-primary">{t('social_media')}</h3>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Facebook className="w-6 h-6 text-gray-400" />
                                    <Instagram className="w-6 h-6 text-gray-400" />
                                    <Twitter className="w-6 h-6 text-gray-400" />
                                    <Linkedin className="w-6 h-6 text-gray-400" />
                                </div>
                            </div>
                            <p className="text-sm text-maryon-text-secondary mb-4">{t('social_media_desc')}</p>
                            <Button variant="secondary">{t('connect_account')}</Button>
                        </div>

                        {/* WhatsApp Business */}
                        <div className="bg-maryon-background border border-maryon-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-maryon-text-primary">{t('whatsapp_business')}</h3>
                                <MessageSquare className={`w-6 h-6 ${isWhatsAppConnected ? 'text-green-500' : 'text-gray-400'}`} />
                            </div>
                            {isWhatsAppConnected ? (
                                <>
                                    <p className="text-sm text-maryon-text-secondary mb-1">
                                        {t('whatsapp_business_desc')}
                                    </p>
                                    <p className="text-sm font-semibold text-maryon-text-primary mb-4">
                                        +966 50 999 9999
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Button variant="secondary" onClick={() => setIsWhatsAppModalOpen(true)}>{t('send')}</Button>
                                        <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => setIsWhatsAppConnected(false)}>{t('disconnect')}</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-maryon-text-secondary mb-4">{t('whatsapp_business_connect_desc')}</p>
                                    <Button variant="secondary" onClick={() => setIsWhatsAppConnected(true)}>{t('connect_account')}</Button>
                                </>
                            )}
                        </div>

                        {/* Email Marketing */}
                        <div className="bg-maryon-background border border-maryon-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-maryon-text-primary">{t('email_marketing')}</h3>
                                <Mail className={`w-6 h-6 ${isEmailConnected ? 'text-blue-500' : 'text-gray-400'}`} />
                            </div>
                            {isEmailConnected ? (
                                <>
                                    <p className="text-sm text-maryon-text-secondary mb-1">
                                        {t('email_marketing_desc')}
                                    </p>
                                    <p className="text-sm font-semibold text-maryon-text-primary mb-4">
                                        maryon@mailchimp.com
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => setIsEmailConnected(false)}>{t('disconnect')}</Button>
                                    </div>
                                </>

                            ) : (
                                <>
                                    <p className="text-sm text-maryon-text-secondary mb-4">{t('email_marketing_connect_desc')}</p>
                                    <Button variant="secondary" onClick={() => setIsEmailConnected(true)}>{t('connect_account')}</Button>
                                </>
                            )}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-maryon-text-primary">{t('email_templates')}</h2>
                        <Button onClick={() => handleOpenTemplateModal()}>
                            <PlusCircle className="w-5 h-5 me-2" />
                            {t('create_template')}
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(template => (
                            <div key={template.id} className="relative group overflow-hidden rounded-lg border border-maryon-border bg-maryon-background">
                                <div className="aspect-w-16 aspect-h-9 bg-maryon-hover">
                                    <img src={template.thumbnailUrl} alt={template.name} className="object-cover w-full h-full" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-maryon-text-primary truncate">{template.name}</h3>
                                    <p className="text-sm text-maryon-text-secondary truncate">{template.subject}</p>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                    <Button variant="secondary" onClick={() => handleOpenTemplateModal(template)}>
                                        <Pencil className="w-4 h-4 me-2" />
                                        {t('edit')}
                                    </Button>
                                    <Button variant="ghost" className="text-red-400 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleDeleteTemplate(template.id)}>
                                        <Trash2 className="w-4 h-4 me-2" />
                                        {t('delete')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-maryon-text-primary">{t('marketing_campaigns')}</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start text-maryon-text-secondary">
                            <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('campaign_name')}</th>
                                    <th scope="col" className="px-6 py-3">{t('status')}</th>
                                    <th scope="col" className="px-6 py-3">{t('channel')}</th>
                                    <th scope="col" className="px-6 py-3">{t('leads_generated')}</th>
                                    <th scope="col" className="px-6 py-3">{t('conversion_rate')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockCampaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-b border-maryon-border hover:bg-maryon-hover">
                                        <th scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap">
                                            {campaign.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[campaign.status]}`}>
                                                {campaign.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{campaign.channel}</td>
                                        <td className="px-6 py-4">{campaign.leadsGenerated}</td>
                                        <td className="px-6 py-4">{(campaign.conversionRate * 100).toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            
            <Modal
                isOpen={isWhatsAppModalOpen}
                onClose={() => setIsWhatsAppModalOpen(false)}
                title={t('send_whatsapp_message')}
            >
                <WhatsAppMessageForm
                    customers={mockCustomers}
                    onSend={handleSendMessage}
                    onCancel={() => setIsWhatsAppModalOpen(false)}
                />
            </Modal>
            
            <Modal
                isOpen={isTemplateModalOpen}
                onClose={handleCloseTemplateModal}
                title={selectedTemplate ? t('edit_template') : t('create_template')}
            >
                <EmailTemplateForm
                    onSave={handleSaveTemplate}
                    onCancel={handleCloseTemplateModal}
                    template={selectedTemplate}
                />
            </Modal>
        </>
    );
};
