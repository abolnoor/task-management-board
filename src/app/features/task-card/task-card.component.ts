import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Task, TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule, 
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  
  onEdit(): void {
    this.edit.emit(this.task);
  }
  
  onDelete(): void {
    this.delete.emit(this.task.id);
  }
  
  getStatusClass(): string {
    switch (this.task.status) {
      case TaskStatus.TODO:
        return 'todo';
      case TaskStatus.IN_PROGRESS:
        return 'in-progress';
      case TaskStatus.DONE:
        return 'done';
      default:
        return '';
    }
  }
  
  getDueDateClass(): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      return 'overdue';
    } else if (dueDate < nextWeek) {
      return 'due-soon';
    } else {
      return 'on-time';
    }
  }
}
