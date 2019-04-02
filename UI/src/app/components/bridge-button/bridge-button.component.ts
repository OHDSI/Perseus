import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bridge-button',
  templateUrl: './bridge-button.component.html',
  styleUrls: ['./bridge-button.component.scss']
})
export class BridgeButtonComponent implements OnInit {
  text = '?';

  constructor() { }

  ngOnInit() {
  }

}
