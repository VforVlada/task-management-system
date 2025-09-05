import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export abstract class TaskRepository {
  abstract list(): Observable<Task[]>;
  abstract get(id: string): Observable<Task | undefined>;
  abstract create(input: Omit<Task, 'id'|'createdAt'|'updatedAt'>): Observable<Task>;
  abstract update(id: string, patch: Partial<Task>): Observable<Task>;
  abstract delete(id: string): Observable<void>;
  resetToSeeds?(): Observable<void>;
}