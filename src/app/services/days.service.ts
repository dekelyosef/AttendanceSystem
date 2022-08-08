import { Injectable } from '@angular/core';
import {Day} from "../models/day";

@Injectable({
  providedIn: 'root'
})
export class DaysService {
  public days!: Day[];

  constructor() {
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
}
