import { Component, OnInit, ViewChild } from '@angular/core';
import {Attendance} from "../../models/attendance";
import {Day} from "../../models/day";
import {AttendanceService} from "../../services/attendance.service";
import {MessagesComponent} from "../messages/messages.component";
import * as XLSX from "xlsx";
import {TranslateService} from "@ngx-translate/core";
import {AttendanceEditComponent} from "../attendance-edit/attendance-edit.component";

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.css']
})
export class AttendancesComponent implements OnInit {

  public records = new Array<Attendance>();
  public dayRecords = new Array<Attendance>();
  public days: Day[] = [];
  public newAttendance = false;
  public tempDay = '';

  @ViewChild(MessagesComponent) message!: MessagesComponent ;
  @ViewChild(AttendanceEditComponent) edit!: AttendanceEditComponent;

  constructor(private attendanceService: AttendanceService, private translate: TranslateService) { }

  ngOnInit() {
    this.days = this.attendanceService.getDays();
    this.getAttendances();
  }

  getAttendances(): void {
    this.attendanceService.getAttendances().subscribe({
      next: (res: Attendance[]) => this.records = res,
      error:(err: any) => this.message.addMessage("error", err.error.error),
    });
  }

  getRecords() {
    return this.records;
  }

  getDayRecords(day: string) {
    this.translate.get(day).subscribe((res: string) => {
      this.tempDay = res;
    });
    this.dayRecords = [];
    this.records.forEach(record => {
      if (this.tempDay === record.day) {
        this.dayRecords.push(record)
      }
    });
    return this.dayRecords;
  }

  addAttendance(attendance: Attendance) {
    if (attendance.id >= 100 || attendance.id < 0) {
      return;
    }
    this.attendanceService.addAttendance(attendance).subscribe({
      next: () => this.getAttendances(),
      error:(err: any) => this.message.addMessage("error", err.error.error),
    });
  }

  updateAttendance(attendance: Attendance) {
    this.attendanceService.updateAttendance(attendance).subscribe({
      next: () => this.getAttendances(),
      error:(err: any) => this.message.addMessage("error", err.error.error),
    });
  }

  deleteAttendance(id: number) {
    this.attendanceService.deleteAttendanceById(id).subscribe({
      next: () => this.getAttendances(),
      error: (err: any) => this.message.addMessage("error", err.error.error),
    });
  }

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

}
