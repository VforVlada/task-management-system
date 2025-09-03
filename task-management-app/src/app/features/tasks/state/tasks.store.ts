import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { Task } from '../../../domain/models/task.model';
import { TaskRepository } from '../../../domain/repositories/task.repo';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private repo = inject(TaskRepository);

  private readonly _tasks$ = new BehaviorSubject<Task[]>([]);
  readonly tasks$ = this._tasks$.asObservable();

  readonly refresh$ = new BehaviorSubject<void>(void 0);

  constructor() {
    this.refresh$
      .pipe(switchMap(() => this.repo.list()))
      .subscribe(list => this._tasks$.next(list));
  }

  load() { this.refresh$.next(); }

  create(input: Omit<Task, 'id'|'createdAt'|'updatedAt'>) {
    return this.repo.create(input).pipe(tap(() => this.load()));
  }
  patch(id: string, patch: Partial<Task>) {
    return this.repo.update(id, patch).pipe(tap(() => this.load()));
  }
  remove(id: string) {
    return this.repo.delete(id).pipe(tap(() => this.load()));
  }
}
