import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type HealthStatus = 'up' | 'down';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  getStatus() {
    return this.http.get<{ status: HealthStatus }>('/api/health');
  }
}
