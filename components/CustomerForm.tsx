import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { Customer } from '../types';

interface CustomerFormProps {
  onSave: (customer: Omit<Customer, 'id' | 'createdAt'> | Customer) => void;
  onCancel: () => void;
  customer?: Customer | null;
}

const getInitialFormData = () => ({
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'Lead' as 'Lead' | 'Contact' | 'Archived',
});

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, onCancel, customer }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      onSave({ ...customer, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {customer && (
        <Input
          id="customerId"
          name="customerId"
          label={t('customer_id')}
          type="text"
          value={customer.id}
          readOnly
          className="bg-maryon-hover cursor-not-allowed"
        />
      )}
      <Input
        id="name"
        name="name"
        label={t('name')}
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        id="company"
        name="company"
        label={t('company')}
        type="text"
        value={formData.company}
        onChange={handleChange}
        required
      />
      <Input
        id="email"
        name="email"
        label={t('email')}
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        id="phone"
        name="phone"
        label={t('phone')}
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <Select
        id="status"
        name="status"
        label={t('status')}
        value={formData.status}
        onChange={handleChange}
      >
        <option value="Lead">Lead</option>
        <option value="Contact">Contact</option>
        <option value="Archived">Archived</option>
      </Select>
      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {customer ? t('update') : t('save')}
        </Button>
      </div>
    </form>
  );
};