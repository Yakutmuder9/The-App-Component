/**
 * Title: security.service.ts
 * Author: Professor Krasso
 * Modified by: Yakut Ahmedin
 * Date: 8/16/23
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number) {
    return this.http.get('/api/employees/' + empId)
  }
}
