import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../../core/models/task.model';

import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskState } from '../../store/dashboard/states/task/task.state';
import { TaskActions } from '../../store/dashboard/states/task/task.actions';


@Component({
  selector: 'app-task-board',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    DragDropModule,
    TaskCardComponent],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Status enum for template
  readonly TaskStatus = TaskStatus;

  // Task lists by status
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  // State observables
  tasks$: Observable<Task[]> = this.store.select(TaskState.getTasks);
  loading$: Observable<boolean> = this.store.select(TaskState.getLoading);
  error$: Observable<string | null> = this.store.select(TaskState.getError);

  ngOnInit(): void {
    // Fetch tasks on component initialization
    this.store.dispatch(new TaskActions.FetchTasks());

    // Subscribe to tasks and filter by status
    this.tasks$.subscribe(tasks => {
      this.todoTasks = tasks.filter(task => task.status === TaskStatus.TODO);
      this.inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
      this.doneTasks = tasks.filter(task => task.status === TaskStatus.DONE);
    });
  }

  // Open dialog to create a new task
  openTaskForm(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { task: null },
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new TaskActions.AddTask(result));
        this.showNotification('Task created successfully');
      }
    });
  }

  // Open dialog to edit an existing task
  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { task },
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new TaskActions.UpdateTask(result));
        this.showNotification('Task updated successfully');
      }
    });
  }

  // Delete task
  deleteTask(id: string): void {
    this.store.dispatch(new TaskActions.DeleteTask(id));
    this.showNotification('Task deleted');
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  // Handle drag and drop between columns
  onDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column 

      // Get the task being moved
      const task = event.item.data;

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.showNotification(`Task reOrdered`);
    } else {
      // Get the task being moved
      const task = event.item.data;

      // Update task status in the store
      this.store.dispatch(new TaskActions.UpdateTaskStatus(task.id, { status: newStatus }));

      // Update local arrays for immediate UI feedback
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.showNotification(`Task moved to ${newStatus}`);
    }


  }

  // Show notification
  showNotification(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
