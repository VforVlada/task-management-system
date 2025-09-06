import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },

  {
    path: 'tasks',
    loadChildren: () =>
      import('./features/tasks/routes').then((m) => m.default),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/routes').then((m) => m.default),
  },
  { path: '**', redirectTo: 'tasks' },
];
