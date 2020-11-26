import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connection-error-popup',
  templateUrl: './connection-error-popup.component.html',
  styleUrls: ['./connection-error-popup.component.scss']
})
export class ConnectionErrorPopupComponent implements OnInit {

  message: string;

  constructor() { }

  ngOnInit(): void {
  }

  onCancel(): void {
  }
}
