import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { ListComponent } from './features/list/list.component';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: ListComponent },
  { path: 'auth', component: AuthComponent }
];
