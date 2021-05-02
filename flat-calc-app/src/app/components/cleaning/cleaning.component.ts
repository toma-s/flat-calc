import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { Observable, of } from 'rxjs';

import { DatabaseService } from 'src/app/services/database.service';
import { CompletedService, CompletedServiceJoinNeighbors, Neighbor, NeighborPoints, Service } from 'src/app/models/database-models';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-cleaning',
  templateUrl: './cleaning.component.html',
  styleUrls: ['./cleaning.component.scss'],
  providers: [DatePipe]
})
export class CleaningComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator)
  completedServicePaginator: MatPaginator;

  @ViewChild('completedServiceSort', { read: MatSort, static: true }) 
  completedServiceSort: MatSort;

  @ViewChild('existingServiceSort', { read: MatSort, static: true }) 
  existingServiceSort: MatSort;

  newCompletedServiceForm: FormGroup = new FormGroup({});
  newServiceForm: FormGroup = new FormGroup({});
  existingServices$: Observable<Service[]> = of();
  completedServices$: Observable<CompletedServiceJoinNeighbors[]> = of();
  neighbors$: Observable<Neighbor[]> = of();
  neighborsWithPoints$: Observable<NeighborPoints[]> = of();

  displayedExistingServiceColumns = ['title', 'details', 'points', /*'update',*/ 'delete'];
  displayedCompletedServicesColumns = ['title', 'name', 'dateCompleted', 'dateCreated', 'comment', 'points', /*'update',*/ 'delete'];

  existingServicesDataSource: MatTableDataSource<Service> = new MatTableDataSource();
  completedServicesDataSource: MatTableDataSource<CompletedServiceJoinNeighbors> = new MatTableDataSource();


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
    this.newServiceForm = new FormGroup({
      title: new FormControl('', Validators.required),
      points: new FormControl('', Validators.required),
      details: new FormControl(''),
    });

    this.completedServices$ = this.databaseService.getCompletedServicesJoinNeighbors();
    this.existingServices$ = this.databaseService.getServicesList();
    this.neighbors$ = this.databaseService.getNeighbors();
    this.neighborsWithPoints$ = this.databaseService.getNeighborsWithPoints();

    this.completedServices$.subscribe((data) => {
      this.completedServicesDataSource = new MatTableDataSource<CompletedServiceJoinNeighbors>(data);
      this.completedServicesDataSource.paginator = this.completedServicePaginator;
      this.completedServicesDataSource.sort = this.completedServiceSort;
    })
    this.existingServices$.subscribe((data) => {
      this.existingServicesDataSource = new MatTableDataSource<Service>(data);
      this.existingServicesDataSource.sort = this.existingServiceSort;
    })

    // this.completedServices$.subscribe((data) => console.log(data));
    // this.existingServices$.subscribe((data) => console.log(data));
  }

  ngAfterViewInit(): void {
    this.completedServicesDataSource.paginator = this.completedServicePaginator;
    this.completedServicesDataSource.sort = this.completedServiceSort;
    this.existingServicesDataSource.sort = this.existingServiceSort;
  }

  addService() {
    this.databaseService
      .putService({
        title: this.newServiceForm?.get('title')?.value,
        points: this.newServiceForm?.get('points')?.value,
        details: this.newServiceForm?.get('details')?.value,
      } as Service)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  addCompletedService() {
    this.databaseService
      .putCompletedService({
        title: this.newCompletedServiceForm?.get('title')?.value.title,
        neighborId: this.newCompletedServiceForm?.get('neighbor')?.value.id,
        dateCreated: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        dateCompleted: this.datePipe.transform(this.newCompletedServiceForm?.get('dateCompleted')?.value, 'yyyy-MM-dd'),
        points: this.newCompletedServiceForm?.get('title')?.value.points,
        comment: this.newCompletedServiceForm?.get('comment')?.value,
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
