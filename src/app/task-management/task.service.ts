import { Injectable } from '@angular/core';
import { Item } from './item.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTask(empId: number) {
    return this.http.get('/api/employees/' + empId + '/tasks')
  }

  addTask(empId: number, task: Item) {
    return this.http.post('/api/employees/' + empId + '/tasks', { task })
  }
}
