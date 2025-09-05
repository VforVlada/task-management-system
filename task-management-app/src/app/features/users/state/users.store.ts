import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, forkJoin, map, shareReplay, switchMap, tap } from 'rxjs';
import { User } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repo';
import { TaskRepository } from '../../../domain/repositories/task.repo';
import { Task } from '../../../domain/models/task.model';

@Injectable({ providedIn: 'root' })
export class UsersStore {
  private repo = inject(UserRepository);
  private taskRepo = inject(TaskRepository);

  private readonly _users$ = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users$.asObservable();

  readonly refresh$ = new BehaviorSubject<void>(void 0);

  constructor() {
   this.refresh$
  .pipe(
    switchMap(() =>
      forkJoin({
        users: this.repo.list(),       
        tasks: this.taskRepo.list(), 
      })
    ),
    map(({ users, tasks }) => {
      const byUser = new Map<string, Task[]>();
      for (const t of tasks) {
        const uid = t.assigneeId;           
        if (!uid) continue;
        if (!byUser.has(uid)) byUser.set(uid, []);
        byUser.get(uid)!.push(t);
      }
      return users.map(u => ({
        ...u,
        tasks: byUser.get(u.id) ?? [],
      }));
    }),
    shareReplay(1)
  )
  .subscribe(usersWithTasks => this._users$.next(usersWithTasks));
  }

  load() { this.refresh$.next(); }

  create(input: Omit<User, 'id'>) {
    return this.repo.create(input).pipe(tap(() => this.load()));
  }
  update(id: string, patch: Partial<User>) {
    return this.repo.update(id, patch).pipe(tap(() => this.load()));
  }
  delete(id: string) {
    return this.repo.delete(id).pipe(tap(() => this.load()));
  }
}
