import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attendance} from "../../models/attendance";

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  @Input()
  day = '';

  @Input()
  records = new Array<Attendance>();

  @Output()
  edit = new EventEmitter<Attendance>();

  @Output()
  delete = new EventEmitter<number>();

  public updateError = "";
  public productDialog: boolean = false;
  public flag = false;

  constructor() {}

  ngOnInit(): void {}

  deleteAttendance(id: number): void {
    this.delete.emit(id);
  }

  editAttendance(attendance: Attendance) {
    this.edit.emit(attendance);
  }

}
