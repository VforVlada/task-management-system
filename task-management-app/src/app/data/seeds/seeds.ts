import { Task, TaskState } from '../../domain/models/task.model';
import { User } from '../../domain/models/user.model';

export const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Katherine Anniston' },
  { id: 'u2', name: 'Robert Smith' },
  { id: 'u3', name: 'Alice Green' },
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    name: 'UI Component Modification',
    description: 'Fix loading and progress bar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: TaskState.InQueue,
    assigneeId: 'u1',
  },
  {
    id: 't2',
    name: 'Fix Abous Us Component',
    description: 'Make background white and add links to social media',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: TaskState.Done,
    assigneeId: 'u2',
  },
  {
    id: 't3',
    name: 'Fix Board layout',
    description: 'Board shows wrong and overflows the page',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: TaskState.Done,
    assigneeId: undefined,
  },
];
