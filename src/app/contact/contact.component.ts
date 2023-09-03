/*
============================================
; Title:  app.js
; Author: Professor Krasso
; Modified By: Yakut Ahmedin
; Date:   24 Aug 2023
; Description: contanct component
;===========================================
*/
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  formData: any = {}; // Initialize formData 

  submitForm() {

     // Check if any required field is empty
     if (!this.formData.name || !this.formData.email) {
      alert("Please fill in all required fields (Name and Email).");
      return; 
    }

    // Display input data in an alert
    alert(`Name: ${this.formData.name}\nEmail: ${this.formData.email}\nPhone: ${this.formData.phone}\nHow Found: ${this.formData.howFound} \n\n Thank You! We recived your information.`);

    // Clear input fields after submitting the form
    this.formData = {};
  }
}
