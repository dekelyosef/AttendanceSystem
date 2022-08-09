import { Injectable } from '@angular/core';
import {Day} from "../models/day";
import {map, Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class DaysService {
  private days = [
    {id: 1, name: 'sunday'},
    {id: 2, name: 'monday'},
    {id: 3, name: 'tuesday'},
    {id: 4, name: 'wednesday'},
    {id: 5, name: 'thursday'},
    {id: 6, name: 'friday'}
  ];

  constructor(private translate: TranslateService) {
  }

  getDays(): Day[] {
    return this.days;
  }

  getDay(day: string): Day {
    return this.days.find(d => d.name === day)!;
  }

  getTranslatedDay(day: string): Observable<string> {
    return this.translate.get(day).pipe(
      map(data => {
        return data;
      }));
  }

}
