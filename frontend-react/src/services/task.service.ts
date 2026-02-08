import api from './api';
import { Task, TaskResponse, CreateTaskDto, UpdateTaskDto } from '../types/task.types';

export const taskService = {
  getTasks: async (page: number = 1, limit: number = 8, search: string = ''): Promise<TaskResponse> => {
    const params: any = { page, limit };
    if (search) {
      params.search = search;
    }
    const response = await api.get<TaskResponse>('/tasks', { params });
    return response.data;
  },

  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  updateTaskCompletion: async (id: string, completed: boolean): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, { completed });
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
