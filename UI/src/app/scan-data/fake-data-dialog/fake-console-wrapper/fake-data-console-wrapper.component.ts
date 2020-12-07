import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fake-data-console-wrapper',
  templateUrl: './fake-data-console-wrapper.component.html',
  styleUrls: ['../../shared/scan-console-wrapper/console-wrapper.component.scss']
})
export class FakeDataConsoleWrapperComponent implements OnInit {

  processFinished = false;

  constructor() { }

  ngOnInit(): void {
  }

}
