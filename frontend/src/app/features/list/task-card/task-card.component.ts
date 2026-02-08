import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../core/services/task.service';
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatIcon
],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() editForm?: FormGroup;
  @Input() isEditing: boolean = false;

  @Output() edit = new EventEmitter<Task>();
  @Output() update = new EventEmitter<string>();
  @Output() completed = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onUpdate(): void {
    this.update.emit(this.task._id);
  }

  onCancel(): void {
    this.cancel.emit(this.task._id);
  }

  onCompleted(): void {
    this.completed.emit(this.task._id);
  }
}
