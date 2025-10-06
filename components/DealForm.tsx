import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { useLocalization } from '../hooks/useLocalization';
import type { Deal, Customer, DealStatus, Assignee } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Sparkles } from 'lucide-react';

interface DealFormProps {
  onSave: (deal: Omit<Deal, 'id'> | Deal) => void;
  onCancel: () => void;
  deal?: Deal | null;
  customers: Customer[];
}

const getInitialFormData = (customers: Customer[]) => ({
  title: '',
  value: 0,
  customerName: customers[0]?.name || '',
  status: 'New Lead' as DealStatus,
  contactDate: new Date().toISOString().split('T')[0],
  assignedTo: 'Sales Team' as Assignee,
});

export const DealForm: React.FC<DealFormProps> = ({ onSave, onCancel, deal, customers }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(getInitialFormData(customers));
  const [isGenerating, setIsGenerating] = useState({ title: false, email: false });
  const [generatedEmail, setGeneratedEmail] = useState('');

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        value: deal.value,
        customerName: deal.customerName,
        status: deal.status,
        contactDate: deal.contactDate,
        assignedTo: deal.assignedTo,
      });
      setGeneratedEmail('');
    } else {
      setFormData(getInitialFormData(customers));
      setGeneratedEmail('');
    }
  }, [deal, customers]);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const handleSuggestTitle = async () => {
    setIsGenerating(prev => ({ ...prev, title: true }));
    try {
        const prompt = `Suggest 5 professional, short deal titles for a real estate opportunity. Customer: "${formData.customerName}", Value: $${formData.value}. Example: "Jeddah Waterfront Apt". Just return the titles separated by newlines.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const suggestedTitle = response.text.split('\n')[0].replace(/"/g, ''); // Take the first suggestion
        setFormData(prev => ({...prev, title: suggestedTitle}));
    } catch (error) {
        console.error("Error suggesting title:", error);
    } finally {
        setIsGenerating(prev => ({ ...prev, title: false }));
    }
  };
  
  const handleGenerateEmail = async () => {
    setIsGenerating(prev => ({ ...prev, email: true }));
    setGeneratedEmail('');
    try {
        const prompt = `Write a professional and friendly follow-up email for a real estate deal. Use the following details: Deal Title: "${formData.title}", Customer Name: "${formData.customerName}", Deal Status: "${formData.status}", Assigned To: "${formData.assignedTo}". The email should be concise and encourage the customer to take the next step.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setGeneratedEmail(response.text);
    } catch (error) {
        console.error("Error generating email:", error);
    } finally {
        setIsGenerating(prev => ({ ...prev, email: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deal) {
      onSave({ ...deal, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Input
            id="title"
            name="title"
            label={t('deal_title')}
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleSuggestTitle} disabled={isGenerating.title} className="flex-shrink-0">
          <Sparkles className={`w-4 h-4 me-2 ${isGenerating.title ? 'animate-spin' : ''}`} />
          {t('suggest_title')}
        </Button>
      </div>

      <Select
        id="customerName"
        name="customerName"
        label={t('customer_name')}
        value={formData.customerName}
        onChange={handleChange}
      >
        {customers.map((customer) => (
          <option key={customer.id} value={customer.name}>
            {customer.name} ({customer.company})
          </option>
        ))}
      </Select>
      <Input
        id="value"
        name="value"
        label={t('deal_value')}
        type="number"
        value={formData.value}
        onChange={handleChange}
        required
      />
      <Input
        id="contactDate"
        name="contactDate"
        label={t('contact_date')}
        type="date"
        value={formData.contactDate}
        onChange={handleChange}
        readOnly={!!deal}
        className={!!deal ? "bg-maryon-hover cursor-not-allowed" : ""}
        required
      />
      <Select
        id="status"
        name="status"
        label={t('status')}
        value={formData.status}
        onChange={handleChange}
      >
        <option value="New Lead">New Lead</option>
        <option value="Contacted">Contacted</option>
        <option value="Proposal">Proposal</option>
        <option value="Negotiation">Negotiation</option>
        <option value="Won">Won</option>
        <option value="Lost">Lost</option>
      </Select>
      <Select
        id="assignedTo"
        name="assignedTo"
        label={t('assigned_to')}
        value={formData.assignedTo}
        onChange={handleChange}
      >
        <option value="Sales Team">Sales Team</option>
        <option value="Marketing Staff">Marketing Staff</option>
        <option value="IT Staff">IT Staff</option>
        <option value="Admin User">Admin User</option>
      </Select>
      
      <div className="space-y-2 pt-4">
         <h3 className="text-sm font-medium text-maryon-text-secondary">{t('ai_deal_assistant')}</h3>
         <Button type="button" variant="secondary" onClick={handleGenerateEmail} disabled={isGenerating.email} className="w-full">
            <Sparkles className={`w-4 h-4 me-2 ${isGenerating.email ? 'animate-spin' : ''}`} />
            {t('generate_email')}
         </Button>
         {generatedEmail && (
            <Textarea 
                id="generatedEmail" 
                label={t('follow_up_email')}
                value={generatedEmail} 
                onChange={e => setGeneratedEmail(e.target.value)} 
                rows={8}
            />
         )}
      </div>

      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {deal ? t('update') : t('save')}
        </Button>
      </div>
    </form>
  );
};
