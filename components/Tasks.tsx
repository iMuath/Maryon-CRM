import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PlusCircle } from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';
import { mockTasks } from '../data/mockData';
import { Modal } from './ui/Modal';
import { TaskForm } from './TaskForm';
import { Select } from './ui/Select';
import type { Task, TaskPriority, TaskStatus, Assignee } from '../types';

export const Tasks: React.FC = () => {
  const { t } = useLocalization();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<Assignee | 'All'>('All');

  const priorityStyles: Record<TaskPriority, { dot: string; text: string }> = {
    'High': { dot: 'bg-red-500', text: 'text-red-600' },
    'Medium': { dot: 'bg-yellow-500', text: 'text-yellow-600' },
    'Low': { dot: 'bg-green-500', text: 'text-green-600' },
  };

  const statusColors: Record<TaskStatus, string> = {
    'To Do': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Done': 'bg-green-100 text-green-800',
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTaskClick = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    // Check if taskData has an 'id' property to determine if it's an update or creation
    if ('id' in taskData) {
      // This is an existing task being updated.
      setTasks(tasks.map(t => (t.id === taskData.id ? taskData : t)));
    } else {
      // This is a new task being created.
      const newTask: Task = {
        ...taskData,
        id: `TSK${(tasks.length + 1).toString().padStart(3, '0')}`,
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
    }
    handleCloseModal();
  };
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = statusFilter === 'All' || task.status === statusFilter;
      const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
      // Fix: Corrected a typo where `assigneeMatch` was used in its own declaration.
      const assigneeMatch = assigneeFilter === 'All' || task.assignedTo === assigneeFilter;
      return statusMatch && priorityMatch && assigneeMatch;
    });
  }, [tasks, statusFilter, priorityFilter, assigneeFilter]);

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-maryon-text-primary">{t('all_tasks')}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
             <Button onClick={handleAddTaskClick} className="w-full sm:w-auto">
                <PlusCircle className="w-5 h-5 me-2" />
                {t('add_task')}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select id="status-filter" label={t('status')} value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
                <option value="All">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
            </Select>
            <Select id="priority-filter" label={t('priority')} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)}>
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </Select>
            <Select id="assignee-filter" label={t('assigned_to')} value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value as any)}>
                <option value="All">All Assignees</option>
                <option value="Sales Team">Sales Team</option>
                <option value="Marketing Staff">Marketing Staff</option>
                <option value="IT Staff">IT Staff</option>
                <option value="Admin User">Admin User</option>
            </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start text-maryon-text-secondary">
            <thead className="text-xs text-maryon-text-secondary uppercase bg-maryon-hover">
              <tr>
                <th scope="col" className="px-6 py-3">{t('title')}</th>
                <th scope="col" className="px-6 py-3">{t('due_date')}</th>
                <th scope="col" className="px-6 py-3">{t('priority')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('assigned_to')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-maryon-border hover:bg-maryon-hover cursor-pointer" onClick={() => handleRowClick(task)}>
                  <th scope="row" className="px-6 py-4 font-medium text-maryon-text-primary whitespace-nowrap">
                    {task.title}
                  </th>
                  <td className="px-6 py-4">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full me-2 ${priorityStyles[task.priority].dot}`}></div>
                      <span className={priorityStyles[task.priority].text}>
                        {task.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{task.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTask ? t('edit_task') : t('add_task')}
      >
        <TaskForm
          onSave={handleSaveTask}
          onCancel={handleCloseModal}
          task={selectedTask}
        />
      </Modal>
    </>
  );
};