import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConnectionResult } from '@models/white-rabbit/connection-result';

@Component({
  selector: 'app-test-connection',
  templateUrl: './test-connection.component.html',
  styleUrls: ['./test-connection.component.scss']
})
export class TestConnectionComponent {

  @Input()
  connectionResult: ConnectionResult;

  @Input()
  disabled: boolean;

  @Input()
  tryConnect = false;

  @Output()
  testConnection = new EventEmitter<void>();

  @Output()
  cancel = new EventEmitter<void>();

  get showTestConnection(): boolean {
    return !this.tryConnect;
  }
}
