import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CleaningComponent } from './components/cleaning/cleaning.component';
import { ExpencesComponent } from './components/expences/expences.component';
import { HouseholdComponent } from './components/household/household.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
