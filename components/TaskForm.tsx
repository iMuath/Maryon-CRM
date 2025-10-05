import React, { useState, useEffect } from 'react';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';
import type { Task, TaskPriority, TaskStatus, Assignee } from '../types';

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
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as any }));
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