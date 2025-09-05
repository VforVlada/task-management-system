import { Observable, defer, of } from 'rxjs';
import { DEFAULT_TASKS, DEFAULT_USERS } from '../seeds/seeds';
import { UserRepository } from '../../domain/repositories/user.repo';
import { User } from '../../domain/models/user.model';

const STORAGE_KEY = 'users_v1';
const VERSION_KEY = STORAGE_KEY + ':version';
const SEED_VERSION = new Date().toISOString();

export class UserLocalRepository implements UserRepository {
  private init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
    }
  }

  private read(): User[] {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  }

  private write(users: User[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  list(): Observable<User[]> {
    return defer(() => of(this.read()));
  }

  get(id: string): Observable<User | undefined> {
    return defer(() => of(this.read().find(u => u.id === id)));
  }

  create(input: Omit<User, 'id'>): Observable<User> {
    return defer(() => {
      const user: User = { id: crypto.randomUUID(), ...input };
      const all = this.read();
      all.push(user);
      this.write(all);
      return of(user);
    });
  }

  update(id: string, patch: Partial<User>): Observable<User> {
    return defer(() => {
      const all = this.read();
      const idx = all.findIndex(u => u.id === id);
      if (idx < 0) throw new Error('User not found');
      const updated: User = { ...all[idx], ...patch };
      all[idx] = updated;
      this.write(all);
      return of(updated);
    });
  }

  delete(id: string): Observable<void> {
    return defer(() => {
      const next = this.read().filter(u => u.id !== id);
      this.write(next);
      return of(void 0);
    });
  }
  
    resetToSeeds() {
      return defer(() => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(VERSION_KEY);
        this.ensureSeed();
        return of(void 0);
      });
    }
    
    private ensureSeed() {
      const v = localStorage.getItem(VERSION_KEY);
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw || v !== SEED_VERSION) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(JSON.parse(JSON.stringify(DEFAULT_TASKS))));
        localStorage.setItem(VERSION_KEY, SEED_VERSION);
      }
    }
  
}
