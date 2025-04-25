import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly API_URL = 'http://localhost:3000';
  
  constructor(private http: HttpClient) {}
  
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks`);
  }
  
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/tasks/${id}`);
  }
  
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/tasks`, task);
  }
  
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/tasks/${task.id}`, task);
  }
  
  updateTaskStatus(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/tasks/${id}`, changes);
  }
  
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tasks/${id}`);
  }
}
