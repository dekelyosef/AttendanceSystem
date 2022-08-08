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

  constructor(private http: HttpClient) { }

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
