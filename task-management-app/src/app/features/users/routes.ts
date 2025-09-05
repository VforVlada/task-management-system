import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { UserListComponent } from './components/user-list/user-list.component';

export const USER_ROUTES = of<Routes>([
  {
    path: '',
    component: UserListComponent 
  }
]);
