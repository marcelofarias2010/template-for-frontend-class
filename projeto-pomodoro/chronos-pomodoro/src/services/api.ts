import type { TaskModel } from '../models/TaskModel';
import type { TaskStateModel } from '../models/TaskStateModel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

type ApiTask = Omit<TaskModel, 'startDate' | 'completeDate' | 'interruptDate'> & {
  startDate: string | number;
  completeDate: string | number | null;
  interruptDate: string | number | null;
};

function normalizeTask(task: ApiTask): TaskModel {
  return {
    ...task,
    startDate: Number(task.startDate),
    completeDate: task.completeDate === null ? null : Number(task.completeDate),
    interruptDate: task.interruptDate === null ? null : Number(task.interruptDate),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export async function getSettings() {
  return request<TaskStateModel['config']>('/settings');
}

export async function updateSettings(config: TaskStateModel['config']) {
  return request<TaskStateModel['config']>('/settings', {
    method: 'PUT',
    body: JSON.stringify(config),
  });
}

export async function getTasks() {
  const tasks = await request<ApiTask[]>('/tasks');
  return tasks.map(normalizeTask);
}

export async function createTask(task: TaskModel) {
  return request<ApiTask>('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export async function completeTask(taskId: string, completeDate: number) {
  return request<ApiTask>(`/tasks/${taskId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ completeDate }),
  });
}

export async function interruptTask(taskId: string, interruptDate: number) {
  return request<ApiTask>(`/tasks/${taskId}/interrupt`, {
    method: 'PATCH',
    body: JSON.stringify({ interruptDate }),
  });
}

export async function clearTasks() {
  return request<void>('/tasks', { method: 'DELETE' });
}
