import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { Deal, Customer, DealStatus, Assignee } from '../types';

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
    } else {
      setFormData(getInitialFormData(customers));
    }
  }, [deal, customers]);

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
      <Input
        id="title"
        name="title"
        label={t('deal_title')}
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
      />
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