import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Service } from 'src/app/models/database-models';

@Component({
  selector: 'app-update-service-modal',
  templateUrl: './update-service-modal.component.html',
  styleUrls: ['./update-service-modal.component.scss']
})
export class UpdateServiceModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Service) {}

  ngOnInit(): void {
  }

}
