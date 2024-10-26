import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AppointmentFormComponent } from './appointment-form.component';
import { AppointmentService } from '../service/appointment.service';
import { Appointment } from '../model/appointment';

describe('AppointmentFormComponent', () => {
  let component: AppointmentFormComponent;
  let fixture: ComponentFixture<AppointmentFormComponent>;
  let appointmentService: AppointmentService;
  let router: Router;

  const appointmentServiceStub = {
    getAppointment: jasmine.createSpy('getAppointment').and.returnValue(of({
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      appointmentDate: '2024-12-31',
      timeSlot: '10:00 AM'
    } as Appointment)),
    updateAppointment: jasmine.createSpy('updateAppointment').and.returnValue(of({
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      appointmentDate: '2024-12-31',
      timeSlot: '10:00 AM'
    } as Appointment)),
    createAppointment: jasmine.createSpy('createAppointment').and.returnValue(of({
      id: 2,
      patientName: 'Jane Doe',
      doctorName: 'Dr. Brown',
      specialization: 'Dermatology',
      appointmentDate: '2024-12-31',
      timeSlot: '11:00 AM'
    } as Appointment))
  };

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  const activatedRouteStub = {
    snapshot: { paramMap: { get: () => '1' } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentFormComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  fit('should_initialize_form_and_set_minDate_on_ngOnInit', () => {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.minDate).toBe(minDate);
    expect(component.appointmentForm).toBeDefined();
  });

  fit('should_call_createAppointment_method_on_form_submission_in_create_mode', () => {
    component.isEditMode = false;

    // Provide valid form data for creation
    component.appointmentForm.setValue({
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      appointmentDate: '2024-08-14',
      timeSlot: '10:00 AM - 11:00 AM'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(appointmentService.createAppointment).toHaveBeenCalled();
  });

  fit('should_call_updateAppointment_method_on_form_submission_in_edit_mode', () => {
    component.isEditMode = true;

    // Provide valid form data
    component.appointmentForm.setValue({
      id: 1,  // Make sure the ID is provided in edit mode
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      appointmentDate: '2024-08-14',
      timeSlot: '10:00 AM - 11:00 AM'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(appointmentService.updateAppointment).toHaveBeenCalled();
  });

  fit('should_display_success_message_after_creating_an_appointment', () => {
    component.isEditMode = false;

    // Provide valid form data
    component.appointmentForm.setValue({
      id: '123',
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      appointmentDate: '2024-08-14',
      timeSlot: '10:00 AM - 11:00 AM'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.successMessage).toBe('Appointment successfully created');
    expect(appointmentService.createAppointment).toHaveBeenCalled();
  });

  fit('should_display_success_message_after_updating_an_appointment', () => {
    component.isEditMode = true;

    const appointmentServiceStub = {
      id: '123',
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
      specialization: 'Cardiology',
      appointmentDate: '2024-08-14',
      timeSlot: '10:00 AM - 11:00 AM'
    };

    component.appointmentForm.setValue({
      id: appointmentServiceStub.id, // Provide the 'id' value here
      patientName: appointmentServiceStub.patientName,
      doctorName: appointmentServiceStub.doctorName,
      specialization: appointmentServiceStub.specialization,
      appointmentDate: appointmentServiceStub.appointmentDate,
      timeSlot: appointmentServiceStub.timeSlot
    });
  
    component.onSubmit();
    fixture.detectChanges();
    expect(component.successMessage).toBe('Appointment successfully updated');
  });
  

  fit('should_navigate_to_appointments_list_after_successful_creation', fakeAsync(() => {
    component.isEditMode = false;
    component.appointmentForm.setValue({
      id: null,
      patientName: 'Jane Doe',
      doctorName: 'Dr. Brown',
      specialization: 'Dermatology',
      appointmentDate: '2024-12-31',
      timeSlot: '11:00 AM'
    });
    component.onSubmit();
    tick(2000); // Simulate the delay
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/appointments']);
  }));

  fit('should_show_form_errors_if_fields_are_missing', () => {
    component.appointmentForm.setValue({
      id: null,
      patientName: '',
      doctorName: '',
      specialization: '',
      appointmentDate: '',
      timeSlot: ''
    });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.appointmentForm.invalid).toBeTrue();
  });

  fit('should_disable_the_submit_button_if_the_form_is_invalid', () => {
    component.appointmentForm.controls['patientName'].setValue('');
    component.appointmentForm.controls['doctorName'].setValue('');
    component.appointmentForm.controls['specialization'].setValue('');
    component.appointmentForm.controls['appointmentDate'].setValue('');
    component.appointmentForm.controls['timeSlot'].setValue('');
    fixture.detectChanges();

    // Get the submit button
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    
    // Check if the button is disabled
    expect(submitButton.disabled).toBeTrue();
  });
});