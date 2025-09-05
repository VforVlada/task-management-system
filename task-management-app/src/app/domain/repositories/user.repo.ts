import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract list(): Observable<User[]>;
  abstract get(id: string): Observable<User | undefined>;
  abstract create(input: Omit<User, 'id'>): Observable<User>;
  abstract update(id: string, patch: Partial<User>): Observable<User>;
  abstract delete(id: string): Observable<void>;
  resetToSeeds?(): Observable<void>;
}
