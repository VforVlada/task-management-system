import { Task, TaskState } from '../../domain/models/task.model';
import { User } from '../../domain/models/user.model';

export const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Kate' },
  { id: 'u2', name: 'Rob' },
  { id: 'u3', name: 'Alice' },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    name: 'Task 1',
    description: 'First task',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: TaskState.InQueue,
    assigneeId: 'u1',
  },
  {
    id: 't2',
    name: 'Task 2',
    description: 'Second task',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: TaskState.Done,
    assigneeId: 'u2',
  },
];
