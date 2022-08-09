import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Attendance} from "../../models/attendance";
import {AttendanceService} from "../../services/attendance.service";
import {map, Observable, Subscription, switchAll} from "rxjs";
import {DaysService} from "../../services/days.service";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnDestroy {

  @Input()
  day = '';

  @Output()
  edit = new EventEmitter<Attendance>();

  @Output()
  delete = new EventEmitter<number>();

  allRecords$!: Observable<Attendance[]>;
  dayRecords$!: Observable<Attendance[]>;
  subscription!: Subscription;

  //
  // public updateError = "";
  // public productDialog: boolean = false;
  // public flag = false;

  constructor(private attendanceService: AttendanceService,
              private dayService: DaysService) { }


  ngOnInit(): void {
    const translatedDay$ = this.dayService.getTranslatedDay(this.day);

    this.allRecords$ = translatedDay$.pipe(
      map(day => this.attendanceService.getDayAttendances(day)),
      switchAll());
    //
    // this.subscription = this.allRecords$.pipe().subscribe(
    //   next => {
    //     if (next !== undefined) {
    //       this.dayRecords$ = next.map(day => this.attendanceService.getDayAttendances(day));
    //       });
    //     }
    //   }
    // );

  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
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
