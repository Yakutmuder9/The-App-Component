import { Injectable } from '@angular/core';
import { Item } from './item.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTask(empId: number) {
    return this.http.get('/api/employees/' + empId)
  }

  addTask(empId: number, task: Item) {
    return this.http.post('/api/employees/' + empId + '/tasks', { task })
  }

  updateTask(empId: number, todo: Item[], done: Item[]) {
    return this.http.put('/api/employees/' + empId + '/tasks', { todo, done })
  }

  deleteTask(empId: number, taskId: string) {
    return this.http.delete('/api/employees/' + empId + '/tasks' + taskId)
  }
}
