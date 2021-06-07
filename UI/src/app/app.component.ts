import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppConnectorService } from '@services/app-connector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('ref', { read: ViewContainerRef, static: true })
  vcRef: ViewContainerRef;

  constructor(private appConnector: AppConnectorService) {
  }

  ngOnInit() {
    this.appConnector.viewContainerRef = this.vcRef
  }
}
