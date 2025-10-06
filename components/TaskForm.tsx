import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { Task, TaskPriority, TaskStatus, Assignee } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Sparkles } from 'lucide-react';

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  onCancel: () => void;
  task?: Task | null;
}

const getInitialFormData = () => ({
  title: '',
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'Medium' as TaskPriority,
  status: 'To Do' as TaskStatus,
  assignedTo: 'Sales Team' as Assignee,
});

export const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, task }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState(getInitialFormData());
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtasks, setSubtasks] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
      });
    } else {
      setFormData(getInitialFormData());
    }
    setSubtasks([]);
    setIsGenerating(false);
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleSuggestSubtasks = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    setSubtasks([]);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const prompt = `Break down the following task into a short, numbered list of actionable sub-tasks: "${formData.title}". Return only the list.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        const resultText = response.text.trim();
        const suggested = resultText.split('\n').map(s => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
        setSubtasks(suggested);
    } catch (error) {
        console.error("Error generating sub-tasks:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onSave({ ...task, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        name="title"
        label={t('title')}
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <Input
        id="dueDate"
        name="dueDate"
        label={t('due_date')}
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        required
      />
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
      <Select
        id="priority"
        name="priority"
        label={t('priority')}
        value={formData.priority}
        onChange={handleChange}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Select>
      <Select
        id="status"
        name="status"
        label={t('status')}
        value={formData.status}
        onChange={handleChange}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </Select>

      <div className="pt-4 space-y-3">
        <h3 className="text-sm font-medium text-maryon-text-secondary">{t('ai_task_breakdown')}</h3>
        <Button type="button" variant="secondary" className="w-full" onClick={handleSuggestSubtasks} disabled={isGenerating || !formData.title}>
          <Sparkles className={`w-4 h-4 me-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {t('suggest_subtasks')}
        </Button>
        {subtasks.length > 0 && (
            <div className="p-3 bg-maryon-hover border border-maryon-border rounded-lg">
                <h4 className="font-semibold text-sm text-maryon-text-primary mb-2">{t('suggested_subtasks')}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-maryon-text-secondary">
                    {subtasks.map((st, i) => <li key={i}>{st}</li>)}
                </ul>
            </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="primary">
          {task ? t('update') : t('save')}
        </Button>
      </div>
    </form>
  );
};
