import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { AuthDialogComponent, AuthDialogMode } from './auth-dialog.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  readonly authMessage = this.authService.authMessage;
  readonly authEmail = this.authService.authEmail;

  ngOnInit(): void {
    this.authService.initFromStorage();
  }

  openDialog(mode: AuthDialogMode): void {
    const dialogRef = this.dialog.open(AuthDialogComponent, {
      data: { mode }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result?.email || !result?.password) {
        return;
      }
      if (mode === 'register') {
        this.authService.register(result.email, result.password);
      } else {
        this.authService.login(result.email, result.password);
      }
    });
  }

  loadProfile(): void {
    this.authService.loadProfile();
  }

  logout(): void {
    this.authService.logout();
  }
}
