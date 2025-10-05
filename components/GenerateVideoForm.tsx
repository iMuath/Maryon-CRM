import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';

interface GenerateVideoFormProps {
  onSave: (data: { prompt: string; duration: number; aspectRatio: string }) => void;
  onCancel: () => void;
}

export const GenerateVideoForm: React.FC<GenerateVideoFormProps> = ({ onSave, onCancel }) => {
  const { t } = useLocalization();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(10);
  const [aspectRatio, setAspectRatio] = useState('16:9');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prompt, duration, aspectRatio });
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
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
        min="1"
        max="60"
        required
      />
      <Select
        id="aspectRatio"
        name="aspectRatio"
        label={t('aspect_ratio')}
        value={aspectRatio}
        onChange={(e) => setAspectRatio(e.target.value)}
      >
        <option value="16:9">16:9 (Landscape)</option>
        <option value="9:16">9:16 (Portrait)</option>
        <option value="1:1">1:1 (Square)</option>
      </Select>
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
