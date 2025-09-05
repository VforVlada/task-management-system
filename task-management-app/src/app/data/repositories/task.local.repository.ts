import { Observable, defer, of } from 'rxjs';
import { Task, TaskState } from '../../domain/models/task.model';
import { TaskRepository } from '../../domain/repositories/task.repo';
import { DEFAULT_TASKS } from '../seeds/seeds';
import { assertTaskBusinessRules } from '../../domain/rules/task.rules';

const STORAGE_KEY = 'tasks_v1';
const VERSION_KEY = STORAGE_KEY + ':version';
const SEED_VERSION = new Date().toISOString();

export class TaskLocalRepository implements TaskRepository {
  private init() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS.map(this.normalizeTask)));
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map(this.normalizeTask);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS.map(this.normalizeTask)));
      }
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS.map(this.normalizeTask)));
    }
  }

  private read(): Task[] {
    this.init();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(this.normalizeTask) : [];
    } catch {
      return [];
    }
  }

  private write(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  list(): Observable<Task[]> {
    this.ensureSeed();
    return defer(() => of(this.read()));
  }

  get(id: string): Observable<Task | undefined> {
    return defer(() => of(this.read().find(t => t.id === id)));
  }

  create(input: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    return defer(() => {
      const now = new Date().toISOString();
      const draft: Task = this.normalizeTask({
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      });

      const all = this.read();
      assertTaskBusinessRules(all, draft);
      all.push(draft);
      this.write(all);
      return of(draft);
    });
  }

  update(id: string, patch: Partial<Task>): Observable<Task> {
    return defer(() => {
      const all = this.read();
      const idx = all.findIndex(t => t.id === id);
      if (idx < 0) throw new Error('Task not found');

      const current = all[idx];
      const next: Task = this.normalizeTask({
        ...current,
        ...patch,
        id: current.id,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
      });

      assertTaskBusinessRules(all, next, current);

      all[idx] = next;
      this.write(all);
      return of(next);
    });
  }

  delete(id: string): Observable<void> {
    return defer(() => {
      const next = this.read().filter(t => t.id !== id);
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

  private normalizeTask(raw: any): Task {
    const id = String(raw?.id ?? crypto.randomUUID());
    const name = String(raw?.name ?? 'Untitled');
    const description =
      raw?.description != null && raw?.description !== '' ? String(raw.description) : undefined;

    const createdAt = String(raw?.createdAt ?? new Date().toISOString());
    const updatedAt = String(raw?.updatedAt ?? createdAt);

    const assigneeId =
      raw?.assigneeId != null && raw?.assigneeId !== '' ? String(raw.assigneeId) : undefined;

    const state: TaskState =
      typeof raw?.state === 'string' && Object.values(TaskState).includes(raw.state as TaskState)
        ? (raw.state as TaskState)
        : TaskState.InQueue;

    const normalizedState = assigneeId ? state : TaskState.InQueue;

    return {
      id,
      name,
      description,
      createdAt,
      updatedAt,
      state: normalizedState,
      assigneeId,
    };
  }
}
