import React, { useState } from 'react';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { useLocalization } from '../hooks/useLocalization';
import type { Customer } from '../types';

interface WhatsAppMessageFormProps {
  customers: Customer[];
  onSend: (data: { recipient: string; message: string }) => void;
  onCancel: () => void;
}

export const WhatsAppMessageForm: React.FC<WhatsAppMessageFormProps> = ({ customers, onSend, onCancel }) => {
  const { t } = useLocalization();
  const [recipient, setRecipient] = useState<string>(customers[0]?.id || '');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !message) {
      alert('Please select a recipient and enter a message.');
      return;
    }
    onSend({ recipient, message });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="recipient"
        name="recipient"
        label={t('recipient')}
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      >
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} - {customer.phone}
          </option>
        ))}
      </Select>
      <Textarea
        id="message"
        name="message"
        label={t('message')}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        placeholder="Type your message here..."
      />
      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {t('send')}
        </Button>
      </div>
    </form>
  );
};