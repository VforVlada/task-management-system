import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, Subject } from 'rxjs';

import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbSidebarModule,
  NbToastrService,
  NbTooltipModule,
  NbUserModule,
  NbWindowRef,
  NbWindowService,
} from '@nebular/theme';

import { Task, TaskState } from '../../../../domain/models/task.model';
import { User } from '../../../../domain/models/user.model';
import { ByStatePipe } from '../../../../shared/pipes/byStatePipe.pipe';
import { TasksStore } from '../../state/tasks.store';
import { UsersStore } from '../../../users/state/users.store';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [
    AsyncPipe,
    ByStatePipe,
    CommonModule,
    DatePipe,
    DragDropModule,
    FormsModule,
    NbBadgeModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbSelectModule,
    NbSidebarModule,
    NbTooltipModule,
    NbUserModule,
    RouterModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  users$!: Observable<User[]>;
  listIds: string[] = [];

  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;

  columns = [
    { state: TaskState.InQueue,    title: 'In Queue',    headerBg: '#eee7ff', headerColor: '#b199e5ff' },
    { state: TaskState.InProgress, title: 'In Progress', headerBg: '#dff4f1', headerColor: '#55bfafff' },
    { state: TaskState.Done,       title: 'Done',        headerBg: '#e7f6df', headerColor: '#73ae53ff' },
  ];

  moreItems = [
    { title: 'Edit' },
    { title: 'Delete' },
  ];

  windowRef?: NbWindowRef;
  saving = false;

  trackById = (_: number, t: Task) => t.id;

  private destroy$ = new Subject<void>();

  constructor(
    private windowService: NbWindowService,
    private usersStore: UsersStore,
    private store: TasksStore,
    private toast: NbToastrService,
  ) {}

  ngOnInit() {
    this.store.load();
    this.usersStore.load();
    this.tasks$ = this.store.tasks$;
    this.users$ = this.usersStore.users$;
    this.listIds = this.columns.map(c => `list-${c.state}`);
  }

  onDrop(event: CdkDragDrop<any>, targetState: TaskState) {
    const task = event.item.data as Task;
    if (!task) return;
    if (task.state === targetState) return;

    if (!task.assigneeId && targetState !== TaskState.InQueue) {
      this.toast?.warning('Unassigned tasks can be only in "In Queue".', 'Moving not allowed');
      return;
    }

    this.store.update(task.id, { state: targetState }).subscribe({
      next: () => {},
      error: (err) => {
        this.toast?.danger((err?.message ?? 'Moving rejected by rules'), 'Cannot move');
      },
    });
  }

  createTask() {
    const task = this.newTask();
    this.windowRef = this.windowService.open(this.contentTemplate, {
      title: 'Create Task',
      context: { text: { ...task }, isCreate: true },
    });
  }

  editTask(task: Task, state?: string) {
    this.windowRef = this.windowService.open(this.contentTemplate, {
      title: 'Edit Task',
      context: { text: { ...task } },
    });
  }

  deleteTask(task: Task) {
    this.store.delete(task.id).subscribe();
  }

  saveTask(
    t: { id?: string; name: string; description?: string; assigneeId?: string },
    isCreate: boolean,
    f: NgForm,
  ) {
    if (f.invalid) return;

    const name = t.name?.trim();
    const description = t.description?.trim() || undefined;

    const patch: Partial<Task> = {
      name,
      description,
      assigneeId: t.assigneeId ?? undefined,
    };
    if (patch.assigneeId == null) patch.state = TaskState.InQueue;

    this.saving = true;

    const req = isCreate
      ? this.store.create(patch as any)
      : this.store.update(String(t.id), patch);

    req.subscribe({
      next: () => {
        this.saving = false;
        this.windowRef?.close();
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  private newTask(): Task {
    const now = new Date().toISOString();
    return {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      createdAt: now,
      updatedAt: now,
      state: TaskState.InQueue,
      assigneeId: undefined,
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
