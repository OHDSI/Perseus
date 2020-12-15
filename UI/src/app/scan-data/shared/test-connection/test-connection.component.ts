import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ConnectionResult } from '../../model/connection-result';

@Component({
  selector: 'app-test-connection',
  templateUrl: './test-connection.component.html',
  styleUrls: ['./test-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestConnectionComponent {

  @Input()
  connectionResult: ConnectionResult;

  @Input()
  disabled: boolean;

  @Output()
  click = new EventEmitter<void>();
}
