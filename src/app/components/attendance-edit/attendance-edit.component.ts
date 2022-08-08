import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import {Attendance} from "../../models/attendance";
import {MessagesComponent} from "../messages/messages.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Day} from "../../models/day";
import {TranslateService} from "@ngx-translate/core";
import {AttendanceService} from "../../services/attendance.service";


@Component({
  selector: 'app-attendance-edit',
  templateUrl: './attendance-edit.component.html',
  styleUrls: ['./attendance-edit.component.css']
})
export class AttendanceEditComponent implements OnInit {
  @Input()
  allRecords = new Array<Attendance>();

  @Output()
  add = new EventEmitter<Attendance>();

  @Output()
  update = new EventEmitter<Attendance>();

  @Output()
  error = new EventEmitter<string>();

  @ViewChild(MessagesComponent) errorMessage!: MessagesComponent ;

  public nameForm: FormGroup;
  public days: Day[] = [];
  public selectedDay: Day | undefined;
  public dayError = "";
  public productDialog: boolean = false;
  public id: number | undefined;
  public flag = true;
  public tempAttendance: Attendance = {id: -1, name: '', day: ''};
  public title = "Attendance details";

  constructor(private attendanceService: AttendanceService, private translate: TranslateService) {
    this.nameForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z\u0590-\u05FF]{2,}(?: [a-zA-Z\u0590-\u05FF]+){1,4}$"),
        Validators.maxLength(30)
      ]),
    });
  }

  ngOnInit(): void {
    this.getDayNames();
  }

  getDayNames() {
    this.attendanceService.getDays().forEach(day => this.translate.get(day.name).subscribe((res: string) => {
      this.days.push({id:day.id , name:res});
    }))
  }

  get fullName() { return this.nameForm.get('fullName'); }

  clearDetails() {
    this.fullName?.reset();
    this.selectedDay = undefined;
    this.id = undefined;
    this.tempAttendance = {id: -1, name: '', day: ''};
  }

  saveAttendance() {
    if (this.selectedDay !== undefined && this.canRegistered()) {
      if (this.id === undefined) {
        let attendance =
          {id: this.getId(), name: this.fullName?.value, day: this.selectedDay.name};
        this.add.emit(attendance);
      } else {
        let attendance =
          {id: this.id, name: this.fullName?.value, day: this.selectedDay.name};
        this.update.emit(attendance);
      }
      this.productDialog = false;
    }
  }

  canRegistered(): boolean {
    let flag = true;
    let sum = 0;
    this.allRecords.forEach(async (record) => {
      if (record.name === this.fullName?.value) {
        sum += 1;
        if (record.day === this.selectedDay?.name) {
          this.errorMessage.addMessage("error","It isn't possible to register more than once on the same day");
          flag = false;
        }
      }
    });
    let max = 3;
    if (this.fullName?.value === this.tempAttendance.name) {
      max = 4;
    }
    if (sum >= max) {
      this.errorMessage.addMessage("error","It isn't possible to work from home more than three days a week");
      flag = false;
    }
    return flag;
  }

  isDisabled(): boolean {
    if (this.showDayError() || this.fullName?.invalid || this.selectedDay === undefined) {
      return true;
    }
    return false;
  }

  getId(): number {
    let id = Math.floor(Math.random() * 100);
    if (this.allRecords.find(attendance => attendance.id === id)) {
      return this.getId();
    }
    return id;
  }

  openUpdateDialog(attendance: Attendance) {
    this.tempAttendance = attendance;
    this.fullName?.setValue(attendance.name);
    this.selectedDay = this.attendanceService.getDay(attendance.day);
    this.id = attendance.id;
    this.productDialog = true;
  }

  openAddDialog() {
    this.clearDetails();
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
  }

  showDayError() {
    if (this.selectedDay === null) {
      this.dayError = "Select day is required";
    } else {
      this.dayError = '';
    }
    return this.dayError;
  }

}
