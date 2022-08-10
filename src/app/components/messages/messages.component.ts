import { Component, OnInit } from '@angular/core';
import {Message, MessageService} from "primeng/api";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  providers: [MessageService]
})
export class MessagesComponent implements OnInit {
  public msg!: Message[];

  constructor(private messageService: MessageService) {
    this.msg = [];
  }

  ngOnInit() { }

  addMessage(type: string, message: string) {
    this.messageService.add({severity: type, summary: type, detail: message});
  }

  clear() {
    this.messageService.clear();
  }
}
