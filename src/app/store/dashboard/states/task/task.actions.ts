import { Task, TaskStatus } from '../../../../core/models/task.model';

export namespace TaskActions {
  // Fetch all tasks
  export class FetchTasks {
    static readonly type = '[Task] Fetch Tasks';
  }

  // Add new task
  export class AddTask {
    static readonly type = '[Task] Add Task';
    constructor(public payload: Omit<Task, 'id'>) { }
  }

  // Update task
  export class UpdateTask {
    static readonly type = '[Task] Update Task';
    constructor(public payload: Task) { }
  }

  // Update task status
  export class UpdateTaskStatus {
    static readonly type = '[Task] Update Task Status';
    constructor(public id: string, public changes: Partial<Task>) { }
  }

  // Delete task
  export class DeleteTask {
    static readonly type = '[Task] Delete Task';
    constructor(public id: string) { }
  }

  // Set loading state
  export class SetLoading {
    static readonly type = '[Task] Set Loading';
    constructor(public loading: boolean) { }
  }

  // Set error state
  export class SetError {
    static readonly type = '[Task] Set Error';
    constructor(public error: string | null) { }
  }
}
