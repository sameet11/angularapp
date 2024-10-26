import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AppointmentListComponent } from './appointment-list.component';
import { AppointmentService } from '../service/appointment.service';
import { Router } from '@angular/router';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let appointmentService: AppointmentService;
  let router: Router;

  beforeEach(async () => {
    const appointmentServiceStub = {
      getAppointments: jasmine.createSpy('getAppointments').and.returnValue(of([
        { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', specialization: 'Cardiology', appointmentDate: '2024-12-31', timeSlot: '10:00 AM' },
        { id: 2, patientName: 'Jane Doe', doctorName: 'Dr. Brown', specialization: 'Dermatology', appointmentDate: '2024-12-31', timeSlot: '11:00 AM' }
      ])),
      deleteAppointment: jasmine.createSpy('deleteAppointment').and.returnValue(of(void 0)) // Mocking void return type
    };

    await TestBed.configureTestingModule({
      declarations: [AppointmentListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceStub }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    // Use the RouterTestingModule to configure the router in tests
    const routerSpy = spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
    appointmentService = TestBed.inject(AppointmentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should_load_appointments_on_initialization', () => {
    component.ngOnInit();
    expect(appointmentService.getAppointments).toHaveBeenCalled();
    expect(component.appointments.length).toBe(2);
  });

  fit('should_display_success_message_after_deletion', () => {
    spyOn(window, 'alert'); // Mock window alert
    component.deleteAppointment(1);
    expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(1);
    expect(component.successMessage).toBe('Appointment successfully deleted');
  });

  fit('should_format_appointment_date_as_dd_MM_yyyy', () => {
    component.appointments = [
      { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', specialization: 'Cardiology', appointmentDate: '31-12-2024', timeSlot: '10:00 AM' }
    ];
    fixture.detectChanges();
    const dateElement = fixture.nativeElement.querySelector('tbody tr td:nth-child(4)');
    expect(dateElement.textContent).toBe('31-12-2024');
  });

  fit('should_display_all_appointments_correctly', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    const firstRowCells = rows[0].querySelectorAll('td');
    expect(firstRowCells[0].textContent).toContain('John Doe');
    expect(firstRowCells[1].textContent).toContain('Dr. Smith');
    expect(firstRowCells[2].textContent).toContain('Cardiology');
    expect(firstRowCells[3].textContent).toContain('31-12-2024');
    expect(firstRowCells[4].textContent).toContain('10:00 AM');
  });

  fit('should_display_an_edit_button_for_each_appointment', () => {
    fixture.detectChanges();
  
    const editButtons = fixture.nativeElement.querySelectorAll('a.edit-button');
    expect(editButtons.length).toBe(2);
  
    // Verify the href of the first edit button
    expect(editButtons[0].getAttribute('href')).toBe('/appointments/edit/1');
    // Verify the href of the second edit button
    expect(editButtons[1].getAttribute('href')).toBe('/appointments/edit/2');
  });

  fit('should_call_deleteAppointment_method_on_delete_button_click', () => {
    spyOn(component, 'deleteAppointment'); // Spy on the delete method
    fixture.detectChanges(); // Ensure changes are applied
  
    const deleteButton = fixture.nativeElement.querySelector('button.delete-button');
    expect(deleteButton).toBeTruthy(); // Ensure the button is present
  
    deleteButton.click(); // Simulate the click
    expect(component.deleteAppointment).toHaveBeenCalledWith(1); // Verify the method was called with the correct ID
  });
});