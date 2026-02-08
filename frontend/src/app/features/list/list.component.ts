import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskService, PaginationInfo } from '../../core/services/task.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TaskCardComponent } from './task-card/task-card.component';

@Component({
  selector: 'app-list',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    TaskCardComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
})
export class ListComponent implements OnInit {
  addTaskForm: FormGroup;
  searchControl = new FormControl('');
  editingForms = new Map<string, FormGroup>();
  tasks = signal<Task[]>([]);
  pagination = signal<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 8
  });

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.addTaskForm = this.taskForm();
  }

  private taskForm(task?: Task): FormGroup {
    return this.fb.group({
      title: [task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [task?.description || '', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    
    // Subscribe to search input with debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadTasks(1); // Reset to page 1 on new search
    });
  }

  private loadTasks(page: number = 1, limit?: number): void {
    const pageSize = limit || this.pagination().itemsPerPage;
    const search = this.searchControl.value || '';
    this.taskService.getTasks(page, pageSize, search).subscribe({
      next: (response) => {
        this.tasks.set(response.tasks);
        this.pagination.set(response.pagination);
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  onPageChange(event: PageEvent): void {
    this.loadTasks(event.pageIndex + 1, event.pageSize);
  }

  addTask(): void {
    if (!this.addTaskForm.valid) return;
    const { title, description } = this.addTaskForm.value;
    this.taskService.createTask({ title, description }).subscribe({
      next: (task) => {
        this.tasks.update(tasks => [...tasks, task]);
        this.addTaskForm.reset();
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

  editTask(task: Task): void {
    const form = this.taskForm(task);
    this.editingForms.set(task._id, form);
  }

  isEditing(id: string): boolean {
    return this.editingForms.has(id);
  }

  getEditForm(id: string): FormGroup | undefined {
    return this.editingForms.get(id);
  }

  updateTask(id: string): void {
    const form = this.editingForms.get(id);
    if (!form?.valid) return;

    const { title, description } = form.value;
    this.taskService.updateTask(id, { title, description }).subscribe({
      next: () => {
        this.editingForms.delete(id);
        this.loadTasks(this.pagination().currentPage);
      },
      error: (err) => console.error('Error updating task:', err)
    });
  }

  cancelEdit(id: string): void {
    this.editingForms.delete(id);
  }

  completeTask(id: string): void {
    const task = this.tasks().find(t => t._id === id);
    if (!task) return;
    this.taskService.updateTaskCompletion(id, !task.completed).subscribe({
      next: () => {
        this.loadTasks(this.pagination().currentPage);
      },
      error: (err) => console.error('Error updating task completion:', err)
    })
  }
}