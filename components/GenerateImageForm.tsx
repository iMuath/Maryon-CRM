import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';

interface GenerateImageFormProps {
  onSave: (data: { width: number; height: number; prompt: string }) => void;
  onCancel: () => void;
}

export const GenerateImageForm: React.FC<GenerateImageFormProps> = ({ onSave, onCancel }) => {
  const { t } = useLocalization();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ width, height, prompt });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <Input
            id="width"
            name="width"
            label={t('image_width')}
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value, 10))}
            min="100"
            max="2000"
            required
          />
          <Input
            id="height"
            name="height"
            label={t('image_height')}
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value, 10))}
            min="100"
            max="2000"
            required
          />
      </div>
      <Input
        id="prompt"
        name="prompt"
        label={t('image_prompt')}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., abstract, landscape, product"
      />
      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {t('generate')}
        </Button>
      </div>
    </form>
  );
};