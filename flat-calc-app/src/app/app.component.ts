import { Component } from '@angular/core';

import { Section, SectionType } from './models/sections';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  sections: SectionType[] = [
    { name: '🧼', value: 'Cleaning'},
    { name: '💸', value: 'Expences'},
    { name: '🏡', value: 'Household list'},
  ];

  currentSection: Section = 'Cleaning';

  setSection(section: Section) {
    this.currentSection = section;
  }
}
