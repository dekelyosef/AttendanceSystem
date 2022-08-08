import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'attendance-system';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('he');
    translate.use('he');
  }
}
