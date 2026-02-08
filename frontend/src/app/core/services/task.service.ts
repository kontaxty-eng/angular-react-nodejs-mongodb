import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface TaskResponse {
  tasks: Task[];
  pagination: PaginationInfo;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);

  getTasks(page: number = 1, limit: number = 8, search: string = ''): Observable<TaskResponse> {
    const params: any = { page: page.toString(), limit: limit.toString() };
    if (search) {
      params.search = search;
    }
    return this.http.get<TaskResponse>('/api/tasks', { params });
  }

  createTask(data: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>('/api/tasks', data);
  }

  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`/api/tasks/${id}`, updates);
  }

  updateTaskCompletion(id: string, completed: boolean): Observable<Task> {
    return this.updateTask(id, { completed });
  }
  
  deleteTask(id:  string): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`);

  }
}
