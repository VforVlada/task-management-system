import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { UserListPage } from './pages/user-list.page';

export const USER_ROUTES = of<Routes>([
  {
    path: '',
    component: UserListPage 
  },
  // {
  //   path: 'new',
  //   component: UserEditPage
  // },
  // {
  //   path: ':id', component: UserListPage
  // },
]);
