import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { User } from '../../../domain/models/user.model';
import { UserRepository } from '../../../domain/repositories/user.repo';

@Injectable({ providedIn: 'root' })
export class UsersStore {
  private repo = inject(UserRepository);

  private readonly _users$ = new BehaviorSubject<User[]>([]);
  readonly users$ = this._users$.asObservable();

  readonly refresh$ = new BehaviorSubject<void>(void 0);

  constructor() {
    this.refresh$
      .pipe(switchMap(() => this.repo.list()))
      .subscribe(list => this._users$.next(list));
  }

  load() { this.refresh$.next(); }

  create(input: Omit<User, 'id'>) {
    return this.repo.create(input).pipe(tap(() => this.load()));
  }
  patch(id: string, patch: Partial<User>) {
    return this.repo.update(id, patch).pipe(tap(() => this.load()));
  }
  remove(id: string) {
    return this.repo.delete(id).pipe(tap(() => this.load()));
  }
}
