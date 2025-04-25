export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done'
  }
  
  export interface Task {
    id?: string;
    title: string;
    description: string;
    dueDate: Date;
    status: TaskStatus;
  }
  
  export interface TaskStateModel {
    tasks: Task[];
    loading: boolean;
    error: string | null;
  }