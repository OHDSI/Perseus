import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppConnectorService } from '@services/app-connector.service';
import { AuthGuard } from '@guards/auth/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('ref', { read: ViewContainerRef, static: true })
  vcRef: ViewContainerRef;

  constructor(private appConnector: AppConnectorService,
              public authGuard: AuthGuard) {
  }

  ngOnInit() {
    this.appConnector.viewContainerRef = this.vcRef
  }
}
