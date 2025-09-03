import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgFor, AsyncPipe, DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TasksStore } from '../../state/tasks.store';

import {
  NbCardModule,
  NbListModule,
  NbIconModule,
  NbButtonModule,
  NbBadgeModule,
  NbLayoutModule,
  NbSidebarModule,
} from '@nebular/theme';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [CommonModule, AsyncPipe, RouterLink, DatePipe,
    NbLayoutModule, 
    NbCardModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbBadgeModule,
  NbSidebarModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  store = inject(TasksStore);

  ngOnInit() {
    this.store.load();
  }
}
