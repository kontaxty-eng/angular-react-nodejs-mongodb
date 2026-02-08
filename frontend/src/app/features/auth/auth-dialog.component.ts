import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export type AuthDialogMode = 'register' | 'login';

interface AuthDialogData {
  mode: AuthDialogMode;
}

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.scss'
})
export class AuthDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AuthDialogComponent>);
  readonly data = inject<AuthDialogData>(MAT_DIALOG_DATA);

  email = '';
  password = '';

  submit(): void {
    this.dialogRef.close({ email: this.email, password: this.password });
  }

  close(): void {
    this.dialogRef.close();
  }
}
