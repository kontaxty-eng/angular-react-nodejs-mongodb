import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService, Task, TaskResponse } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getTasks', () => {
    it('should return tasks with pagination', () => {
      const mockResponse: TaskResponse = {
        tasks: [
          { _id: '1', title: 'Task 1', description: 'Desc 1', completed: false, createdAt: new Date().toISOString() },
          { _id: '2', title: 'Task 2', description: 'Desc 2', completed: true, createdAt: new Date().toISOString() }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 2,
          itemsPerPage: 8
        }
      };

      service.getTasks(1, 8).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.tasks.length).toBe(2);
        expect(response.pagination.currentPage).toBe(1);
      });

      const req = httpMock.expectOne('/api/tasks?page=1&limit=8');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should include search parameter when provided', () => {
      const mockResponse: TaskResponse = {
        tasks: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 8
        }
      };

      service.getTasks(1, 8, 'test').subscribe();

      const req = httpMock.expectOne('/api/tasks?page=1&limit=8&search=test');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('search')).toBe('test');
      req.flush(mockResponse);
    });

    it('should use default values', () => {
      const mockResponse: TaskResponse = {
        tasks: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 8
        }
      };

      service.getTasks().subscribe();

      const req = httpMock.expectOne('/api/tasks?page=1&limit=8');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should not include search param if empty string', () => {
      const mockResponse: TaskResponse = {
        tasks: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 8
        }
      };

      service.getTasks(1, 8, '').subscribe();

      const req = httpMock.expectOne('/api/tasks?page=1&limit=8');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('search')).toBe(false);
      req.flush(mockResponse);
    });
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      const createdTask: Task = {
        _id: '123',
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };

      service.createTask(newTask).subscribe(task => {
        expect(task).toEqual(createdTask);
        expect(task._id).toBe('123');
      });

      const req = httpMock.expectOne('/api/tasks');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTask);
      req.flush(createdTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task', () => {
      const taskId = '123';
      const updateData = { title: 'Updated', description: 'Updated Desc' };
      const updatedTask: Task = {
        _id: taskId,
        ...updateData,
        completed: false,
        createdAt: new Date().toISOString()
      };

      service.updateTask(taskId, updateData).subscribe(task => {
        expect(task).toEqual(updatedTask);
      });

      const req = httpMock.expectOne(`/api/tasks/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedTask);
    });
  });

  describe('updateTaskCompletion', () => {
    it('should update task completion status', () => {
      const taskId = '123';
      const updatedTask: Task = {
        _id: taskId,
        title: 'Task',
        description: 'Desc',
        completed: true,
        createdAt: new Date().toISOString()
      };

      service.updateTaskCompletion(taskId, true).subscribe(task => {
        expect(task.completed).toBe(true);
      });

      const req = httpMock.expectOne(`/api/tasks/${taskId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ completed: true });
      req.flush(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      const taskId = '123';

      service.deleteTask(taskId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`/api/tasks/${taskId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
