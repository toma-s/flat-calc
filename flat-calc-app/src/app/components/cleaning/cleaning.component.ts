import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { Services } from 'src/app/types/database-models';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss']
})
export class CleaningComponent implements OnInit {

  newServiceForm: FormGroup;
  services$: Observable<any>;
  displayedColumns = ['name', 'details', 'points'];

  constructor(
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.newServiceForm = new FormGroup({
      name: new FormControl('', Validators.required),
      comment: new FormControl(''),
      points: new FormControl('', Validators.required),
    });
    this.services$ = this.databaseService.getServices();
  }

  submit() {
    this.databaseService
    .putService({ 
      name: this.newServiceForm?.get('name')?.value,
      comment: this.newServiceForm?.get('comment')?.value,
      points: this.newServiceForm?.get('points')?.value,
     })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
    this.services$ = this.databaseService.getServices();
  }

}
