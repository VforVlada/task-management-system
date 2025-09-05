import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, Subject, filter, map, take, takeUntil } from 'rxjs';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuService,
  NbSidebarModule,
  NbToastrService,
  NbTooltipModule,
  NbWindowRef,
  NbWindowService,
} from '@nebular/theme';

import { UsersStore } from '../../state/users.store';
import { TasksStore } from '../../../tasks/state/tasks.store';
import { Task, TaskState } from '../../../../domain/models/task.model';
import { User } from '../../../../domain/models/user.model';

@Component({
  standalone: true,
  selector: 'app-user-list',
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    FormsModule,
    DragDropModule,
    NbLayoutModule,
    NbCardModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbBadgeModule,
    NbTooltipModule,
    NbContextMenuModule,
    NbInputModule,
    NbSidebarModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  stateTitleMap = new Map<TaskState, string>();
  stateStyleMap = new Map<TaskState, { bg: string; color: string }>();

  private destroy$ = new Subject<void>();
  saving = false;

  users$!: Observable<User[]>;
  listIds: string[] = [];

  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;

  columns = [
    { state: TaskState.InQueue,    title: 'In Queue',    headerBg: '#eee7ff', headerColor: '#b199e5ff' },
    { state: TaskState.InProgress, title: 'In Progress', headerBg: '#dff4f1', headerColor: '#55bfafff' },
    { state: TaskState.Done,       title: 'Done',        headerBg: '#e7f6df', headerColor: '#73ae53ff'  },
  ];

  userMenu = [
    { title: 'Edit' },
    { title: 'Delete' },
  ];

  windowRef?: NbWindowRef;

  constructor(
    private toast: NbToastrService,
    private windowService: NbWindowService,
    private store: UsersStore,
    private tasksStore: TasksStore,
    private menu: NbMenuService,
  ) {}

  ngOnInit() {
    this.store.load();

    this.users$ = this.store.users$.pipe(
      map(users =>
        (users ?? []).slice().sort((a, b) =>
          (a?.name ?? '').trim().localeCompare(
            (b?.name ?? '').trim(),
            ['uk', 'pt', 'en'],
            { sensitivity: 'base', ignorePunctuation: true, numeric: true },
          ),
        ),
      ),
    );

    this.users$.subscribe(users => {
      this.listIds = users.map(u => this.getListId(u.id));
    });

    this.menu.onItemClick()
      .pipe(
        takeUntil(this.destroy$),
        filter(({ tag }) => !!tag),
      )
      .subscribe(({ item, tag }) => {
        const userId = String(tag);
        switch (item?.title) {
          case 'Edit':
            this.editUser(userId);
            break;
          case 'Delete':
            this.store.delete(userId).subscribe();
            break;
        }
      });

    this.stateTitleMap = new Map(this.columns.map(c => [c.state, c.title]));
    this.stateStyleMap = new Map(this.columns.map(c => [c.state, { bg: c.headerBg, color: c.headerColor }]));
  }

  connectedTo(currentUserId: string): string[] {
    const selfId = this.getListId(currentUserId);
    return this.listIds.filter(id => id !== selfId);
  }

  createUser() {
    const user = this.newUser();
    this.windowRef = this.windowService.open(this.contentTemplate, {
      title: 'Create User',
      context: { text: { ...user }, isCreate: true },
    });
  }

  editUser(userId: string) {
    this.users$
      .pipe(
        take(1),
        map(list => list.find(u => String(u.id) === String(userId))),
      )
      .subscribe(u => {
        if (!u) return;
        this.windowRef = this.windowService.open(this.contentTemplate, {
          title: 'Edit User',
          context: { text: { ...u }, isCreate: false },
        });
      });
  }

  tasksOf(u: User): Task[] {
    return u.tasks ?? [];
  }

  getListId(userId: string) {
    return `list-${userId}`;
  }

  onDrop(event: CdkDragDrop<Task[]>, toUser: User) {
    const src = event.previousContainer.data;
    const dst = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(dst, event.previousIndex, event.currentIndex);
      return;
    }

    const moved = src[event.previousIndex];

    transferArrayItem(src, dst, event.previousIndex, event.currentIndex);

    const changes: Partial<Task> = {
      assigneeId: String(toUser.id),
      updatedAt: new Date().toISOString(),
      state: TaskState.InQueue,
    };

    this.tasksStore.update(moved.id, changes)?.pipe(take(1)).subscribe({
      next: () => {},
      error: () => {
        transferArrayItem(dst, src, event.currentIndex, event.previousIndex);
        this.toast.danger('Failed to save. Rolled back');
      },
    });
  }

  deleteTask(user: User) {
    this.store.delete(user.id).subscribe();
  }

  saveUser(
    t: { id?: string; name: string; description?: string; assigneeId?: string },
    isCreate: boolean,
    f: NgForm,
  ) {
    if (f.invalid) return;

    const name = t.name?.trim();

    const patch: Partial<User> = { name };

    this.saving = true;

    const req = isCreate
      ? this.store.create(patch as any)
      : this.store.update(String(t.id), patch);

    req.subscribe({
      next: () => { this.saving = false; this.windowRef?.close(); },
      error: () => { this.saving = false; },
    });
  }

  private newUser(): User {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      name: '',
      tasks: [],
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
