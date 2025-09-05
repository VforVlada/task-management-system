import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskState } from '../../domain/models/task.model';

@Pipe({
  name: 'byState',
  standalone: true,
  pure: true,
})
export class ByStatePipe implements PipeTransform {
  transform(tasks: Task[] | null | undefined, state: TaskState): Task[] {
    if (!tasks?.length) return [];
    return tasks.filter(t => t.state === state);
  }
}
