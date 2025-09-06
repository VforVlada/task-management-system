import { User } from './user.model';

export enum TaskState {
  InQueue = 'in queue',
  InProgress = 'in progress',
  Done = 'done',
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  state: TaskState;
  assigneeId?: string;
  user?: User;
}
