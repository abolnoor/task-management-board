import { Component, EventEmitter, Inject, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Task, TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  taskForm!: FormGroup;
  statusOptions = Object.values(TaskStatus);
  editMode = false;
  
  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task }
  ) {}
  
  ngOnInit(): void {
    this.initForm();
    if (this.data.task) {
      this.editMode = true;
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        dueDate: this.data.task.dueDate,
        status: this.data.task.status
      });
    }
  }
  
  initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      dueDate: ['', [Validators.required, this.futureDateValidator()]],
      status: [TaskStatus.TODO]
    });
  }
  
  futureDateValidator() {
    return (control: any) => {
      if (!control.value) return null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0);
      
      return selectedDate >= today ? null : { futureDate: true };
    };
  }
  
  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
    
    const formValues = this.taskForm.value;
    
    const task: any = {
      title: formValues.title,
      description: formValues.description,
      dueDate: formValues.dueDate,
      status: formValues.status
    };
    
    if (this.editMode && this.data.task) {
      task.id = this.data.task.id;
    }
    
    this.dialogRef.close(task);
  }
}
