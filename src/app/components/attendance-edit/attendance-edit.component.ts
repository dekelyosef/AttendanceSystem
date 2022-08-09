import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import {Attendance} from "../../models/attendance";
import {MessagesComponent} from "../messages/messages.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Day} from "../../models/day";
import {TranslateService} from "@ngx-translate/core";
import {AttendanceService} from "../../services/attendance.service";
import {DaysService} from "../../services/days.service";
import { map, Observable} from "rxjs";


@Component({
  selector: 'app-attendance-edit',
  templateUrl: './attendance-edit.component.html',
  styleUrls: ['./attendance-edit.component.css']
})
export class AttendanceEditComponent implements OnInit {

  allRecords$!: Observable<Attendance[]>;

  @Output()
  add = new EventEmitter<Attendance>();

  @Output()
  update = new EventEmitter<Attendance>();

  @Output()
  error = new EventEmitter<string>();

  @ViewChild(MessagesComponent) errorMessage!: MessagesComponent ;

  public days!: Day[];
  public dayError = "";
  public productDialog: boolean = false;
  public id = -1;
  public flag = true;
  // public tempAttendance: Attendance = {id: -1, name: '', day: ''};
  public title = "Attendance details";

  public form = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-zA-Z\u0590-\u05FF]{2,}(?: [a-zA-Z\u0590-\u05FF]+){1,4}$"),
      Validators.maxLength(30)
    ]),
    day: new FormControl('', Validators.required)
  });

  constructor(private attendanceService: AttendanceService,
              private daysService: DaysService,
              private translate: TranslateService) {
    this.allRecords$ = this.attendanceService.getAttendances();
    this.getDayNames();
  }

  ngOnInit(): void { }

  control(name: string): FormControl<any> {
    return this.form.get(name)! as FormControl<any>;
  }

  getDayNames() {
    this.days = [];
    this.daysService.getDays().forEach(day => this.translate.get(day.name).subscribe((res: string) => {
      this.days.push({id:day.id , name:res});
    }))
  }

  clearDetails() {
    this.form.reset();
    // this.selectedDay = undefined;
    this.id = -1;
    // this.tempAttendance = {id: -1, name: '', day: ''};
  }

  async saveAttendance(): Promise<void> {
    console.log("save");
    if (this.id === -1) {
      await this.attendanceService.addAttendance(
        this.control("fullName").value, this.control("day").value);
    } else {
      const attendance = {
        id: this.id,
        name: this.control("fullName").value,
        day: this.control("day").value
      };
      await this.attendanceService.updateAttendance(attendance);
    }
    this.productDialog = false;
  }

  canRegistered(): void {
    const registrations$ = this.allRecords$.pipe(
      map(records => (records.filter(record => record.name === this.control("fullName").value))
      ));



    // this.allRecords$.pipe(
    //   map(records =>
    //     console.log(records.filter(record => record.name === this.control("fullName").value))
    //   ));

    registrations$.pipe(
      map(records => records.map(async record => {
        console.log(record);
        if (record.day === this.control("day").value) {
          console.log("It isn't possible to register more than once on the same day");
          this.errorMessage.addMessage(
            "error", "It isn't possible to register more than once on the same day");
        } else if (records.length >= 3) {
          console.log("It isn't possible to work from home more than three days a week");
          this.errorMessage.addMessage(
            "error", "It isn't possible to work from home more than three days a week");
        } else {
          await this.saveAttendance();
        }
      }))
    );


    // this.allRecords$.forEach(async (record) => {
    //   if (record.name === this.fullName?.value) {
    //     sum += 1;
    //     if (record.day === this.selectedDay?.name) {
    //       flag = false;
    //     }
    //   }
    // });
    // let max = 3;
    // if (this.fullName?.value === this.tempAttendance.name) {
    //   max = 4;
    // }
    //
    // const length = registrations$.pipe(
    //   map(records => records.length)
    // );
    //
    // if (length >= 3) {
    //   flag = false;
    // }
  }

  openUpdateDialog(attendance: Attendance) {
    // this.tempAttendance = attendance;
    this.control("fullName").setValue(attendance.name);
    this.control("day").setValue(attendance.day);
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

  // showDayError() {
  //   if (this.control("day").invalid) {
  //     this.dayError = "Select day is required";
  //   } else {
  //     this.dayError = '';
  //   }
  //   return this.dayError;
  // }

}
