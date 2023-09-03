/*
============================================
; Title:  item.interface.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date:   14 Aug 2023
; Description: item interface
;===========================================
*/
export interface Category {
    categoryName: string
    backgroundColor: string
}

export interface Item {
    _id?: string     //optional property
    text: string
    category: Category
}