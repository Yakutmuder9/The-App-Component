/*
============================================
; Title:  employee.interface.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date:   14 Aug 2023
; Description: employee interface
;===========================================
*/

import { Item } from "./item.interface";

export interface Employee {
    empId: number
    todo: Item[]
    done: Item[]
}