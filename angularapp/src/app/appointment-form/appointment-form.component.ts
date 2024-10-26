import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../model/appointment';
 
@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
 
  appointmentForm: FormGroup;
  isEditMode: boolean = false;
  minDate: string = new Date().toISOString().split('T')[0];  // Minimum date set to today
  successMessage: string = '';
  id:string
  check:boolean=false;
  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
this.appointmentForm = this.fb.group({
      id: [''],
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      specialization: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required]
    });
  }
 
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEditMode = true;
      // Fetch the appointment details to pre-fill the form
      this.appointmentService.getAppointment(+this.id).subscribe((appointment: Appointment) => {
        this.appointmentForm.patchValue(appointment);
      });
    }
  }
 
  // Method to handle form submission
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      return;
    }
    this.check=true;
    const appointmentData: Appointment = this.appointmentForm.value;
 
    if (this.isEditMode) {
this.appointmentService.updateAppointment(+this.id, appointmentData).subscribe((data) => {
        this.successMessage = 'Appointment successfully updated';
        setTimeout(()=>{
          this.router.navigate(['/appointments']);
        },1000)
      });
    } else {
      this.appointmentService.createAppointment(appointmentData).subscribe((data) => {
        this.successMessage = 'Appointment successfully created';
        setTimeout(()=>{
          this.router.navigate(['/appointments']);
        },1000)
      });
    }
  }
}