import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConnectorService } from '@services/app-connector.service';

@Component({
  template: ''
})
export class ServerErrorComponent implements OnInit {

  constructor(private appConnector: AppConnectorService,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    const {componentRef, payload} = this.appConnector.dynamicComponent
    this.matDialog.open(payload, {panelClass: 'perseus-dialog'})
      .afterClosed()
      .subscribe(() => {
        componentRef.destroy()
        this.appConnector.dynamicComponent = null
      })
  }
}
