import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';

import { DatabaseService } from 'src/app/services/database.service';
import { CompletedService, CompletedServiceJoinNeighbors, Neighbor, Service } from 'src/app/models/database-models';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss'],
  providers: [DatePipe]
})
export class CleaningComponent implements OnInit {

  newCompletedServiceForm: FormGroup = new FormGroup({});
  newServiceListForm: FormGroup = new FormGroup({});
  existingServices$: Observable<Service[]> = of();
  completedServices$: Observable<CompletedServiceJoinNeighbors[]> = of();
  neighbors$: Observable<Neighbor[]> = of();

  displayedColumns = ['title', 'details', 'points', /*'update',*/ 'delete'];
  displayedCompletedServicesColumns = ['what', 'who', 'when', 'date-created', 'comment', 'points', /*'update',*/ 'delete'];

  servicesListDataSource: any;
  completedServicesListDataSource: any;


  constructor(
    private databaseService: DatabaseService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.newCompletedServiceForm = new FormGroup({
      title: new FormControl('', Validators.required),
      neighbor: new FormControl('', Validators.required),
      dateCreated: new FormControl(new Date(), Validators.required),
      dateCompleted: new FormControl(new Date(), Validators.required),
      comment: new FormControl(''),
    });
    this.newServiceListForm = new FormGroup({
      title: new FormControl('', Validators.required),
      details: new FormControl(''),
      points: new FormControl('', Validators.required),
    });

    this.completedServices$ = this.databaseService.getCompletedServicesJoinNeighbors();
    this.existingServices$ = this.databaseService.getServicesList();

    this.completedServices$.subscribe((data) => {
      console.log('MatTableDataSource');

      return this.completedServicesListDataSource = new MatTableDataSource<CompletedServiceJoinNeighbors>(data);
    })
    this.existingServices$.subscribe((data) => this.servicesListDataSource = new MatTableDataSource<Service>(data))


    this.neighbors$ = this.databaseService.getNeighbors();

    this.completedServices$.subscribe((data) => console.log(data));
    this.existingServices$.subscribe((data) => console.log(data));
  }

  addService() {
    this.databaseService
      .putService({
        title: this.newServiceListForm?.get('title')?.value,
        details: this.newServiceListForm?.get('details')?.value,
        points: this.newServiceListForm?.get('points')?.value,
      } as Service)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  addCompletedService() {
    this.databaseService
      .putCompletedService({
        title: this.newCompletedServiceForm?.get('title')?.value.title,
        neighborId: this.newCompletedServiceForm?.get('neighbor')?.value.id,
        comment: this.newCompletedServiceForm?.get('comment')?.value,
        dateCreated: this.datePipe.transform(new Date(), 'MMMM d, y'),
        dateCompleted: this.datePipe.transform(this.newCompletedServiceForm?.get('dateCompleted')?.value, 'MMMM d, y'),
        points: this.newCompletedServiceForm?.get('title')?.value.points,
      } as CompletedService)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  deleteService(id: string) {
    this.databaseService.deleteService(id);
  }

  deleteCompletedService(id: string) {
    this.databaseService.deleteCompletedService(id);
  }

  updateService(id: string, service: any) {
    // const oldServiceData: CleaningService = {
    //   title: service.name,
    //   details: service.details,
    //   points: service.points,
    // }
    // this.dialog.open(UpdateServiceModalComponent, {
    //   data: {
    //     title: service.name,
    //     details: service.details,
    //     points: service.points,
    //   }
    // });

    // const newData = 'todo get new data';

    // TODO submit update
    // this.databaseService.updateService(id, newData);
  }

  updateCompletedService(service: any) {
    // TODO submit update
    // this.databaseService.updateService(id, newData);
  }

}
