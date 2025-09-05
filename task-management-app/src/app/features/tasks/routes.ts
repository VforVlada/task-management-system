import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { TaskListComponent } from './components/task-list/task-list.component';

export const TASK_ROUTES = of<Routes>([
  {
    path: '',
    component: TaskListComponent
  }
]);
