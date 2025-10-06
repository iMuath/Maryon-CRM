import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { EmailTemplate } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles } from 'lucide-react';

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
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate an email template for a real estate company based on this prompt: "${aiPrompt}". Provide a catchy subject line and a well-structured HTML body. Use placeholders like {{name}} for personalization.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING, description: 'The full HTML body of the email.' },
                    }
                }
            }
        });
        
        const json = JSON.parse(response.text);
        setFormData(prev => ({
            ...prev,
            subject: json.subject || '',
            body: json.body || ''
        }));
    } catch (error) {
        console.error("Error generating template:", error);
    } finally {
        setIsGenerating(false);
    }
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
      <div className="p-4 bg-maryon-hover rounded-lg border border-maryon-border space-y-2">
          <label htmlFor="ai-prompt" className="flex items-center text-sm font-medium text-maryon-text-primary">
            <Sparkles className="w-4 h-4 me-2 text-maryon-accent" />
            {t('generate_with_ai')}
          </label>
          <div className="flex gap-2">
            <Input
              id="ai-prompt"
              name="ai-prompt"
              label=""
              type="text"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder={t('ai_prompt_placeholder')}
              className="!m-0"
            />
            <Button type="button" onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt}>
                {isGenerating ? t('generating') : t('generate')}
            </Button>
          </div>
      </div>
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
