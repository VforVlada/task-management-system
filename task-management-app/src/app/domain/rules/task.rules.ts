import { Task, TaskState } from '../models/task.model';

export function userHasTaskInProgress(tasks: Task[], userId: string, excludeTaskId?: string): boolean {
  return tasks.some(t =>
    t.id !== (excludeTaskId ?? '') &&
    t.assigneeId === userId &&
    t.state === TaskState.InProgress
  );
}

export function changeStateIfNoAssignee(state: TaskState, assigneeId?: string): TaskState {
  return assigneeId ? state : TaskState.InQueue;
}

export function assertTaskBusinessRules(all: Task[], candidate: Task, prev?: Task): void {
  if (!candidate.assigneeId && candidate.state !== TaskState.InQueue) {
    throw new Error("Task without assignee can only be 'in queue'");
  }

  if (candidate.assigneeId && candidate.state === TaskState.InProgress) {
    if (userHasTaskInProgress(all, candidate.assigneeId, candidate.id)) {
      throw new Error("This user already has a task 'in progress'");
    }
  }

  if (prev && prev.assigneeId && !candidate.assigneeId && candidate.state !== TaskState.InQueue) {
    throw new Error("Removing assignee requires state to be 'in queue'");
  }
}

export function assignTask(task: Task, userId: string): Task {
  return { ...task, assigneeId: userId, state: changeStateIfNoAssignee(task.state, userId) };
}

export function unassignTask(task: Task): Task {
  return { ...task, assigneeId: undefined, state: TaskState.InQueue };
}

export function setTaskState(task: Task, next: TaskState): Task {
  if (!task.assigneeId) return { ...task, state: TaskState.InQueue };
  return { ...task, state: next };
}
