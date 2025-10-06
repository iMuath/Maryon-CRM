import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';

interface GenerateImageFormProps {
  onSave: (data: { prompt: string; aspectRatio: string }) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const GenerateImageForm: React.FC<GenerateImageFormProps> = ({ onSave, onCancel, isGenerating }) => {
  const { t } = useLocalization();
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prompt, aspectRatio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="prompt"
        name="prompt"
        label={t('image_prompt')}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A robot holding a red skateboard"
        required
      />
       <div className="grid grid-cols-2 gap-4">
          <Input
            id="width"
            name="width"
            label={t('image_width')}
            type="number"
            value={800}
            readOnly
            className="bg-maryon-hover"
          />
          <Input
            id="height"
            name="height"
            label={t('image_height')}
            type="number"
            value={800}
            readOnly
            className="bg-maryon-hover"
          />
      </div>
      
      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isGenerating}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isGenerating}>
          {isGenerating ? t('generating') : t('generate')}
        </Button>
      </div>
    </form>
  );
};
