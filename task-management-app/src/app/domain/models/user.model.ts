import { Task } from './task.model';

export interface User {
  id: string;
  name: string;
  tasks?: Task[];
}
