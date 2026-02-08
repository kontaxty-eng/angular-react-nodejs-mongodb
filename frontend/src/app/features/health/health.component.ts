import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HealthService, HealthStatus } from '../../core/services/health.service';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent implements OnInit {
  private readonly healthService = inject(HealthService);
  readonly status = signal<HealthStatus | 'unknown'>('unknown');

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.healthService.getStatus().subscribe({
      next: (data) => this.status.set(data.status ?? 'down'),
      error: () => this.status.set('down')
    });
  }
}
