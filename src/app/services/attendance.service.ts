import {Injectable} from '@angular/core';
import {catchError, Observable, map, BehaviorSubject, Subject, takeUntil, take} from "rxjs";
import {Attendance} from "../models/attendance";
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {Message, MessageService} from "primeng/api";
import {State} from "../models/state";
import {TranslateService} from "@ngx-translate/core";
import {Day} from "../models/day";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = environment.apiUrl;
  private messages!: Message[];

  private records: Attendance[] = [];
  private records$ = new BehaviorSubject<Attendance[]>(this.records);

  constructor(private http: HttpClient,
                    private messageService: MessageService) {
    this.messages = [];
    this.initializeAttendances();
  }

  initializeAttendances(): void {
    this.http.get<Attendance[]>(this.apiUrl + '/attendances').pipe(take(1)).subscribe(
      data => {
        this.records = data;
        this.records$.next(this.records);
      });
  }

  getAttendances(): Observable<Attendance[]> {
    return this.records$.asObservable();
  }

  async addAttendance(name: string, day: string): Promise<void> {
    const attendance: Attendance = {
      id: this.getId(),
      name: name,
      day: day
    };
    this.http.post<Attendance>(this.apiUrl + '/add', attendance).pipe(take(1)).subscribe(
      data => {
        this.records = [...this.records, data];
        this.records$.next(this.records);
      }),
      catchError(async (err) => this.addMessage("error", err.error.error));
      // err => this.addMessage("error", err.error.error));
  }

  getId(): number {
    let id = Math.floor(Math.random() * 100);
    if (this.records.find(attendance => attendance.id === id)) {
      return this.getId();
    }
    return id;
  }

  async updateAttendance(attendance: Attendance): Promise<void> {
    this.http.put<Attendance>(this.apiUrl + '/update', attendance).pipe(take(1)).subscribe(
      data => {
        this.records = [...this.records, data];
        this.records$.next(this.records);
      }),
      catchError(async (err) => this.addMessage("error", err.error.error));
  }

  async deleteAttendanceById(id: number): Promise<void> {
    this.http.delete<Attendance>(this.apiUrl + '/delete/' + id).pipe(take(1)).subscribe(
      data => {
        this.records = this.records.filter(attendance => attendance.id !== data.id);
        this.records$.next(this.records);
      }),
      catchError(async (err) => this.addMessage("error", err.error.error));
    this.records$.next(this.records);
  }

  // getDayRecords(day: string) {
  //   return this.records$.asObservable().pipe(
  //     map(data => data.filter(record => record.day === this.day))
  //   );
  //   let tempDay!: Day;
  //   this.translate.get(day).pipe(
  //     map(data => tempDay = data)
  //   );
  //   return this.records.attendances.filter(record => record.day === day);
  // }

  getDayAttendances(day: string): Observable<Attendance[]> {
    return this.records$.asObservable().pipe(
      map(data => data.filter(record => record.day === day)));
  }

  addMessage(type: string, message: string) {
    this.messageService.add({severity: type, summary: type, detail: message});
  }

  clear() {
    this.messageService.clear();
  }

  getJasperReport(): Observable<any> {
    return this.http.get(this.apiUrl + '/report');
  }

}
