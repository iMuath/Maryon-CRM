import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';

interface GenerateVideoFormProps {
  onSave: (data: { prompt: string }) => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export const GenerateVideoForm: React.FC<GenerateVideoFormProps> = ({ onSave, onCancel, isGenerating }) => {
  const { t } = useLocalization();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prompt });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="prompt"
        name="prompt"
        label={t('video_prompt')}
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., a horse running on a beach"
        required
      />
      <Input
        id="duration"
        name="duration"
        label={t('video_duration')}
        type="number"
        value={4}
        readOnly
        className="bg-maryon-hover"
      />
      <Select
        id="aspectRatio"
        name="aspectRatio"
        label={t('aspect_ratio')}
        value={"16:9"}
        readOnly
        className="bg-maryon-hover"
      >
        <option value="16:9">16:9 (Landscape)</option>
        <option value="9:16">9:16 (Portrait)</option>
        <option value="1:1">1:1 (Square)</option>
      </Select>
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
