import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Day} from "../models/day";
import {Attendance} from "../models/attendance";
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = environment.apiUrl;
  public days: Day[] = [];

  constructor(private http: HttpClient) {
    this.days = [
      {id: 1, name: 'sunday'},
      {id: 2, name: 'monday'},
      {id: 3, name: 'tuesday'},
      {id: 4, name: 'wednesday'},
      {id: 5, name: 'thursday'},
      {id: 6, name: 'friday'}
    ];
  }

  getDays(): Day[] {
    return this.days;
  }

  getDay(day: string): Day | undefined {
    return this.days.find(d => d.name === day);
  }

  getAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl + '/attendances');
  }

  addAttendance(attendance: Attendance): Observable<any> {
    return this.http.post(this.apiUrl + '/add', attendance);
  }

  updateAttendance(attendance: Attendance): Observable<any> {
    return this.http.put(this.apiUrl + '/update', attendance);
  }

  deleteAttendanceById(id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/delete/' + id);
  }

  getJasperReport(): Observable<any> {
    return this.http.get(this.apiUrl + '/report');
  }

}
