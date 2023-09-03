/*
============================================
; Title:  task.service.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date:   14 Aug 2023
; Description: ask service for managing tasks related to employees.
;===========================================
*/
import { Injectable } from '@angular/core';
import { Item } from './item.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  // Retrieves tasks for a specific employee.
  getTask(empId: number) {
    return this.http.get('/api/employees/' + empId)
  }

  // Adds a new task for a specific employee.
  addTask(empId: number, task: Item) {
    return this.http.post('/api/employees/' + empId + '/tasks', { task })
  }

  // Updates tasks for a specific employee.
  updateTask(empId: number, todo: Item[], done: Item[]) {
    return this.http.put('/api/employees/' + empId + '/tasks', { todo, done })
  }

  // Deletes a specific task for an employee.
  deleteTask(empId: number, taskId: string) {
    return this.http.delete('/api/employees/' + empId + '/tasks/' + taskId)
  }
}
