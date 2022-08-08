import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AttendancesComponent } from './components/attendances/attendances.component';
import { DayComponent } from './components/day/day.component';
import { AttendanceEditComponent } from './components/attendance-edit/attendance-edit.component';
import { MessagesComponent } from './components/messages/messages.component';
import {HttpClient} from "@angular/common/http";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { FileSaverModule } from 'ngx-filesaver';
import {MessageService} from "primeng/api";
import {MessagesModule} from "primeng/messages";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import { HttpClientModule } from "@angular/common/http";
import {RippleModule} from "primeng/ripple";


@NgModule({
  declarations: [
    AppComponent,
    AttendancesComponent,
    DayComponent,
    AttendanceEditComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FileSaverModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MessagesModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    DropdownModule,
    ReactiveFormsModule,
    DialogModule,
    RippleModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../../assets/i18n/', '.json');
}
