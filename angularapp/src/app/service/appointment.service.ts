import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../model/appointment';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
 
  constructor(private http:HttpClient) { }
 
  getAppointments():Observable<Appointment[]>{
    return this.http.get<Appointment[]>(environment.apiUrl);
  }
 
  getAppointment(id:number):Observable<Appointment>{
    return this.http.get<Appointment>(environment.apiUrl+"/"+id);
  }
 
  createAppointment(appointment:Appointment):Observable<Appointment>{
    return this.http.post<Appointment>(environment.apiUrl,appointment);
  }
 
  updateAppointment(id:number,appointment:Appointment):Observable<Appointment>{
    return this.http.put<Appointment>(environment.apiUrl+"/"+id,appointment);
  }
 
  deleteAppointment(id:number):Observable<Boolean>{
    return this.http.delete<Boolean>(environment.apiUrl+"/"+id);
  }
 
}
 