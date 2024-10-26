import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/appointments', pathMatch: 'full' },
  {path: 'appointments', component: AppointmentListComponent },
  {path:'appointments/add', component:AppointmentFormComponent},
  {path:'appointments/edit/:id',component:AppointmentFormComponent},
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }