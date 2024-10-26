import { Component, OnInit } from '@angular/core';
import { Appointment } from '../model/appointment';
import { AppointmentService } from '../service/appointment.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointments : Appointment []=[];
  successMessage: string = '';
  constructor(private appointmentService:AppointmentService, private router:Router) {
   }
 
  ngOnInit(): void {
    this.getAppointments();
  }
  getAppointments(){
    this.appointmentService.getAppointments().subscribe(
      (data: Appointment[]) => {
        this.appointments = data?.map(appointment => ({
          ...appointment,
          appointmentDate: this.formatDate(appointment.appointmentDate)
        }));
        this.successMessage='';
      },
      error => {
        console.error('Error fetching appointments', error);
      }
    );
  }
  deleteAppointment(id:number){
    this.appointmentService.deleteAppointment(id).subscribe(data=>{
      this.successMessage="Appointment successfully deleted";
      setTimeout(()=>{
        this.getAppointments()
      },800)
    },
    error => {
      console.error('Error deleting appointment', error);
    })
  }
  private formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

}
