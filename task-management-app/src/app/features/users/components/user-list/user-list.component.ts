import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  NbCardModule,
  NbListModule,
  NbIconModule,
  NbButtonModule,
  NbBadgeModule,
  NbLayoutModule,
  NbSidebarModule,
} from '@nebular/theme';
import { UsersStore } from '../../state/users.store';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [CommonModule, AsyncPipe, RouterLink,
    NbLayoutModule, 
    NbCardModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbBadgeModule,
  NbSidebarModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListPage implements OnInit {
 store = inject(UsersStore);

  ngOnInit() {
    this.store.load();
  }
}
