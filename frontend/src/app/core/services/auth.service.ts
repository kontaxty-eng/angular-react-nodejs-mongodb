import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly authToken = signal<string | null>(null);
  readonly authEmail = signal<string | null>(null);
  readonly authMessage = signal<string | null>(null);

  initFromStorage(): void {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('authEmail');
    if (token) {
      this.authToken.set(token);
      this.authEmail.set(email);
    }
  }

  register(email: string, password: string): void {
    this.authMessage.set(null);
    this.http
      .post<{ token: string; email: string }>('/api/auth/register', { email, password })
      .subscribe({
        next: (data) => {
          this.setToken(data.token, data.email);
          this.authMessage.set('Registered successfully');
        },
        error: (err) => this.authMessage.set(err?.error?.message || 'Registration failed')
      });
  }

  login(email: string, password: string): void {
    this.authMessage.set(null);
    this.http
      .post<{ token: string; email: string }>('/api/auth/login', { email, password })
      .subscribe({
        next: (data) => {
          this.setToken(data.token, data.email);
          this.authMessage.set('Logged in');
        },
        error: (err) => this.authMessage.set(err?.error?.message || 'Login failed')
      });
  }

  loadProfile(): void {
    const token = this.authToken();
    if (!token) {
      this.authMessage.set('No token stored');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<{ email: string }>('/api/auth/me', { headers }).subscribe({
      next: (data) => {
        this.authEmail.set(data.email);
        this.authMessage.set('Profile loaded');
      },
      error: (err) => this.authMessage.set(err?.error?.message || 'Profile failed')
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    this.authToken.set(null);
    this.authEmail.set(null);
    this.authMessage.set('Logged out');
  }

  private setToken(token: string, email: string): void {
    this.authToken.set(token);
    this.authEmail.set(email);
    localStorage.setItem('authToken', token);
    localStorage.setItem('authEmail', email);
  }
}
