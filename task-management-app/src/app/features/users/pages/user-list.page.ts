import { Component, OnInit, inject } from '@angular/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { UsersStore } from '../state/users.store';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [NgFor, AsyncPipe],
  template: `
    <div class="flex items-center justify-between">
      <h2>Users</h2>
      <a routerLink="new">+ New User</a>
    </div>
    
     <ul>
      <li *ngFor="let u of store.users$ | async" class="py-2">
        <a><strong>{{ u.name }}</strong></a>
      </li>
    </ul>
  `,
})
export class UserListPage implements OnInit {
  store = inject(UsersStore);
  ngOnInit() { this.store.load(); }
}
