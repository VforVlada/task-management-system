import { Routes } from '@angular/router';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },

  {
    path: 'tasks',
    loadChildren: () =>
      from(import('./features/tasks/routes')).pipe(
        switchMap(m => m.TASK_ROUTES) 
      )
  },
  {
    path: 'users',
    loadChildren: () =>
      from(import('./features/users/routes')).pipe(
        switchMap(m => m.USER_ROUTES)
      )
  },

  { path: '**', redirectTo: 'tasks' }
];
