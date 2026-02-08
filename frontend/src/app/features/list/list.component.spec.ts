import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { ListComponent } from './list.component';
import { TaskService, Task, TaskResponse } from '../../core/services/task.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      completed: true,
      createdAt: new Date().toISOString()
    }
  ];

  const mockTaskResponse: TaskResponse = {
    tasks: mockTasks,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 8
    }
  };

  beforeEach(async () => {
    const taskServiceMock = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'updateTaskCompletion',
      'deleteTask'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ListComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatPaginatorModule,
        MatIconModule
      ],
      providers: [{ provide: TaskService, useValue: taskServiceMock }]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    taskServiceSpy.getTasks.and.returnValue(of(mockTaskResponse));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    fixture.detectChanges();

    expect(taskServiceSpy.getTasks).toHaveBeenCalledWith(1, 8, '');
    expect(component.tasks().length).toBe(2);
    expect(component.pagination().totalItems).toBe(2);
  });

  describe('searchControl', () => {
    it('should filter tasks when search value changes', (done) => {
      fixture.detectChanges();

      const filteredResponse: TaskResponse = {
        tasks: [mockTasks[0]],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 8
        }
      };

      taskServiceSpy.getTasks.and.returnValue(of(filteredResponse));

      component.searchControl.setValue('Task 1');

      // Wait for debounce
      setTimeout(() => {
        expect(taskServiceSpy.getTasks).toHaveBeenCalledWith(1, 8, 'Task 1');
        expect(component.tasks().length).toBe(1);
        done();
      }, 350);
    });

    it('should clear search when clearSearch is called', () => {
      component.searchControl.setValue('test');
      expect(component.searchControl.value).toBe('test');

      component.clearSearch();

      expect(component.searchControl.value).toBe('');
    });
  });

  describe('addTask', () => {
    it('should create a new task with valid form', () => {
      const newTask: Task = {
        _id: '3',
        title: 'New Task',
        description: 'New Description',
        completed: false,
        createdAt: new Date().toISOString()
      };

      taskServiceSpy.createTask.and.returnValue(of(newTask));
      fixture.detectChanges();

      component.addTaskForm.patchValue({
        title: 'New Task',
        description: 'New Description'
      });

      component.addTask();

      expect(taskServiceSpy.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description'
      });
      expect(component.tasks().length).toBe(3);
      expect(component.addTaskForm.value.title).toBeNull();
    });

    it('should not create task with invalid form', () => {
      fixture.detectChanges();
      component.addTaskForm.patchValue({ title: '', description: '' });

      component.addTask();

      expect(taskServiceSpy.createTask).not.toHaveBeenCalled();
    });

    it('should handle creation error', () => {
      taskServiceSpy.createTask.and.returnValue(
        throwError(() => new Error('Creation failed'))
      );
      fixture.detectChanges();

      spyOn(console, 'error');
      component.addTaskForm.patchValue({
        title: 'New Task',
        description: 'New Description'
      });

      component.addTask();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('editTask', () => {
    it('should create edit form for task', () => {
      fixture.detectChanges();
      const task = mockTasks[0];

      component.editTask(task);

      expect(component.isEditing(task._id)).toBe(true);
      const form = component.getEditForm(task._id);
      expect(form?.value.title).toBe(task.title);
      expect(form?.value.description).toBe(task.description);
    });

    it('should allow multiple tasks to be edited', () => {
      fixture.detectChanges();

      component.editTask(mockTasks[0]);
      component.editTask(mockTasks[1]);

      expect(component.isEditing(mockTasks[0]._id)).toBe(true);
      expect(component.isEditing(mockTasks[1]._id)).toBe(true);
    });
  });

  describe('updateTask', () => {
    it('should update task with valid form', () => {
      const updatedTask = { ...mockTasks[0], title: 'Updated Title' };
      taskServiceSpy.updateTask.and.returnValue(of(updatedTask));
      taskServiceSpy.getTasks.and.returnValue(of(mockTaskResponse));
      fixture.detectChanges();

      component.editTask(mockTasks[0]);
      const form = component.getEditForm(mockTasks[0]._id)!;
      form.patchValue({ title: 'Updated Title' });

      component.updateTask(mockTasks[0]._id);

      expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(mockTasks[0]._id, {
        title: 'Updated Title',
        description: mockTasks[0].description
      });
      expect(component.isEditing(mockTasks[0]._id)).toBe(false);
    });

    it('should not update task with invalid form', () => {
      fixture.detectChanges();
      component.editTask(mockTasks[0]);
      const form = component.getEditForm(mockTasks[0]._id)!;
      form.patchValue({ title: '' });

      component.updateTask(mockTasks[0]._id);

      expect(taskServiceSpy.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('cancelEdit', () => {
    it('should remove edit form', () => {
      fixture.detectChanges();
      component.editTask(mockTasks[0]);
      expect(component.isEditing(mockTasks[0]._id)).toBe(true);

      component.cancelEdit(mockTasks[0]._id);

      expect(component.isEditing(mockTasks[0]._id)).toBe(false);
    });
  });

  describe('onPageChange', () => {
    it('should load tasks for new page', () => {
      fixture.detectChanges();
      const event: PageEvent = {
        pageIndex: 1,
        pageSize: 8,
        length: 16
      };

      component.onPageChange(event);

      expect(taskServiceSpy.getTasks).toHaveBeenCalledWith(2, 8, '');
    });

    it('should handle page size change', () => {
      fixture.detectChanges();
      const event: PageEvent = {
        pageIndex: 0,
        pageSize: 10,
        length: 16
      };

      component.onPageChange(event);

      expect(taskServiceSpy.getTasks).toHaveBeenCalledWith(1, 10, '');
    });
  });
});
