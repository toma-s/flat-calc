import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatabaseService } from './services/database.service';

import firebase from "firebase/app";
import { Observable } from 'rxjs';
import { Section, SectionType } from './models/sections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  mainForm: FormGroup;
  // db;

  messages$: Observable<any>;

  sections: SectionType[] = [
    { name: '🧼', value: 'Cleaning'},
    { name: '💸', value: 'Expences'},
    { name: '🏡', value: 'Household list'},
  ];

  currentSection: Section = 'Cleaning';
  

  constructor(
    private databaseService: DatabaseService
  ) {
    // this.databaseService.initializeDB();
    // this.db = firebase.database();
  }


  ngOnInit() {
    this.mainForm = new FormGroup({
      who: new FormControl(''),
      whom: new FormControl(''),
      amount: new FormControl(''),
      message: new FormControl(''),
    });
    this.messages$ = this.databaseService.getMessages();
  }

  submit() {
    this.databaseService.putMessage({message: this.mainForm?.get('message')?.value}).then((data) => console.log(data)).catch((err) => console.log(err));
    this.messages$ = this.databaseService.getMessages();
  }

  setSection(section: Section) {
    this.currentSection = section;
  }
}
