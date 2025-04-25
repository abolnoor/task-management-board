import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { TaskActions } from './task.actions';
import { Task, TaskStateModel, TaskStatus } from '../../../../core/models/task.model';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';

@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class TaskState {
  private taskService = inject(TaskService);
  
  @Selector()
  static getTasks(state: TaskStateModel): Task[] {
    return state.tasks;
  }

  @Selector()
  static getTasksByStatus(state: TaskStateModel) {
    return (status: TaskStatus) => {
      return state.tasks.filter(task => task.status === status);
    };
  }

  @Selector()
  static getLoading(state: TaskStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: TaskStateModel): string | null {
    return state.error;
  }


  // Actions
  @Action(TaskActions.FetchTasks)
  fetchTasks(ctx: StateContext<TaskStateModel>) {
    ctx.dispatch(new TaskActions.SetLoading(true));
    return this.taskService.getTasks().pipe(
      tap(tasks => {
        ctx.patchState({
          tasks,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.dispatch(new TaskActions.SetError(error.message));
        ctx.dispatch(new TaskActions.SetLoading(false));
        return of(error);
      })
    );
  }

  @Action(TaskActions.AddTask)
  addTask(ctx: StateContext<TaskStateModel>, action: TaskActions.AddTask) {
    ctx.dispatch(new TaskActions.SetLoading(true));
    return this.taskService.createTask(action.payload).pipe(
      tap(task => {
        const state = ctx.getState();
        ctx.patchState({
          tasks: [...state.tasks, task],
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.dispatch(new TaskActions.SetError(error.message));
        ctx.dispatch(new TaskActions.SetLoading(false));
        return of(error);
      })
    );
  }

  @Action(TaskActions.UpdateTask)
  updateTask(ctx: StateContext<TaskStateModel>, action: TaskActions.UpdateTask) {
    ctx.dispatch(new TaskActions.SetLoading(true));
    return this.taskService.updateTask(action.payload).pipe(
      tap(updatedTask => {
        const state = ctx.getState();
        const tasks = state.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
        ctx.patchState({
          tasks,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.dispatch(new TaskActions.SetError(error.message));
        ctx.dispatch(new TaskActions.SetLoading(false));
        return of(error);
      })
    );
  }

  @Action(TaskActions.UpdateTaskStatus)
  updateTaskStatus(ctx: StateContext<TaskStateModel>, action: TaskActions.UpdateTaskStatus) {
    ctx.dispatch(new TaskActions.SetLoading(true));
    return this.taskService.updateTaskStatus(action.id, action.changes).pipe(
      tap(updatedTask => {
        const state = ctx.getState();
        const tasks = state.tasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
        ctx.patchState({
          tasks,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.dispatch(new TaskActions.SetError(error.message));
        ctx.dispatch(new TaskActions.SetLoading(false));
        return of(error);
      })
    );
  }

  @Action(TaskActions.DeleteTask)
  deleteTask(ctx: StateContext<TaskStateModel>, action: TaskActions.DeleteTask) {
    ctx.dispatch(new TaskActions.SetLoading(true));
    return this.taskService.deleteTask(action.id).pipe(
      tap(() => {
        const state = ctx.getState();
        const tasks = state.tasks.filter(task => task.id !== action.id);
        ctx.patchState({
          tasks,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        ctx.dispatch(new TaskActions.SetError(error.message));
        ctx.dispatch(new TaskActions.SetLoading(false));
        return of(error);
      })
    );
  }

  @Action(TaskActions.SetLoading)
  setLoading(ctx: StateContext<TaskStateModel>, action: TaskActions.SetLoading) {
    ctx.patchState({
      loading: action.loading
    });
  }

  @Action(TaskActions.SetError)
  setError(ctx: StateContext<TaskStateModel>, action: TaskActions.SetError) {
    ctx.patchState({
      error: action.error
    });
  }
}
