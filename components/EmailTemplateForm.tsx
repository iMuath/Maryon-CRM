import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { EmailTemplate } from '../types';

interface EmailTemplateFormProps {
  onSave: (template: Omit<EmailTemplate, 'id' | 'thumbnailUrl'> | EmailTemplate) => void;
  onCancel: () => void;
  template?: EmailTemplate | null;
}

const getInitialFormData = () => ({
  name: '',
  subject: '',
  body: '',
});

export const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({ onSave, onCancel, template }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [template]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (template) {
      onSave({ ...template, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        name="name"
        label={t('template_name')}
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        id="subject"
        name="subject"
        label={t('subject')}
        type="text"
        value={formData.subject}
        onChange={handleChange}
        required
      />
      <Textarea
        id="body"
        name="body"
        label={t('template_body')}
        value={formData.body}
        onChange={handleChange}
        rows={10}
        required
        placeholder="Start writing your email template here..."
      />
      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {template ? t('update') : t('save')}
        </Button>
      </div>
    </form>
  );
};
