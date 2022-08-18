import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attendance } from "../../models/attendance";
import { AttendanceService } from "../../services/attendance.service";
import { map, Observable, switchAll } from "rxjs";
import { DaysService } from "../../services/days.service";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  @Input()
  day = '';

  @Output()
  edit = new EventEmitter<Attendance>();

  @Output()
  delete = new EventEmitter<number>();

  dayRecords$!: Observable<Attendance[]>;

  constructor(private attendanceService: AttendanceService,
              private dayService: DaysService) { }

  ngOnInit(): void {
    const translatedDay$ = this.dayService.getTranslatedDay(this.day);

    this.dayRecords$ = translatedDay$.pipe(
      map(day => this.attendanceService.getDayAttendances(day)),
      switchAll());
  }

  async deleteAttendance(id: number): Promise<void> {
    // await this.attendanceService.deleteAttendanceById(id);
    this.delete.emit(id);
  }

  async editAttendance(attendance: Attendance) {
    // await this.attendanceService.updateAttendance(attendance);
    this.edit.emit(attendance);
  }

}
