import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, switchMap, map, tap, distinctUntilChanged } from 'rxjs';
import { Task } from '../../../domain/models/task.model';
import { TaskRepository } from '../../../domain/repositories/task.repo';
import { UserRepository } from '../../../domain/repositories/user.repo';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly repo = inject(TaskRepository);
  private readonly usersRepo = inject(UserRepository);

  private readonly _tasks$ = new BehaviorSubject<Task[]>([]);
  readonly tasks$: Observable<Task[]> = this._tasks$.asObservable();

  readonly refresh$ = new BehaviorSubject<void>(void 0);

  constructor() {
    this.refresh$
      .pipe(
        switchMap(() =>
          forkJoin({
            tasks: this.repo.list(),
            users: this.usersRepo.list(),
          })
        ),
        map(({ tasks, users }) => {
          const byId = new Map(users.map(u => [u.id, u]));
          return tasks.map<Task>(t => ({
            ...t,
            user: t.assigneeId ? (byId.get(t.assigneeId) ?? undefined) : undefined,
          }));
        })
      )
      .subscribe(list => this._tasks$.next(list));
  }

  load(): void {
    this.refresh$.next();
  }

  getById$(id: string | number): Observable<Task | undefined> {
    const key = String(id);
    return this.tasks$.pipe(
      tap(list => { if (!list || list.length === 0) this.load(); }),
      map(list => list.find(t => String(t.id) === key)),
      distinctUntilChanged((a, b) => {
        if (a?.id !== b?.id) return false;
        return a?.updatedAt === b?.updatedAt;
      })
    );
  }

  create(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.repo.create(input).pipe(tap(() => this.load()));
  }

  update(id: string, patch: Partial<Task>) {
    return this.repo.update(id, patch).pipe(tap(() => this.load()));
  }

  delete(id: string): Observable<void> {
    return this.repo.delete(id).pipe(tap(() => this.refresh$.next()));
  }
}
