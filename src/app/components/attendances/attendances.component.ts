import { Component, OnInit, ViewChild } from '@angular/core';
import {Attendance} from "../../models/attendance";
import {Day} from "../../models/day";
import {AttendanceService} from "../../services/attendance.service";
import {MessagesComponent} from "../messages/messages.component";
import * as XLSX from "xlsx";
import {TranslateService} from "@ngx-translate/core";
import {AttendanceEditComponent} from "../attendance-edit/attendance-edit.component";
import {DaysService} from "../../services/days.service";
import {Observable} from "rxjs";
import {State} from "../../models/state";

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.css']
})
export class AttendancesComponent implements OnInit {

  allRecords$!: Observable<Attendance[]>;

  public records = new Array<Attendance>();
  public dayRecords = new Array<Attendance>();
  public days: Day[] = [];
  public newAttendance = false;
  public tempDay = '';

  @ViewChild(MessagesComponent) message!: MessagesComponent ;
  @ViewChild(AttendanceEditComponent) edit!: AttendanceEditComponent;

  constructor(private attendanceService: AttendanceService,
              private daysService: DaysService,
              private translate: TranslateService) {
    this.days = this.daysService.getDays();
    this.allRecords$ = this.attendanceService.getAttendances();
  }

  ngOnInit() { }

  addError(err: string) {
    this.message.addMessage("error", err);
  }

  editAttendance(attendance: Attendance) {
    this.edit.openUpdateDialog(attendance);
  }

  editNewAttendance() {
    this.newAttendance = true;
    this.edit.openAddDialog();
  }

  exportDB() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(this.records);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance_table");
    XLSX.writeFileXLSX(workbook, "Attendance_system.xlsx");
  }

  report() {
    this.attendanceService.getJasperReport().subscribe({
      next: (res) => this.message.addMessage("success", res),
      error: (err) => this.message.addMessage("error", err.error.error),
    });
  }

  async deleteAttendance(id: number): Promise<void> {
    await this.attendanceService.deleteAttendanceById(id);
  }

}
