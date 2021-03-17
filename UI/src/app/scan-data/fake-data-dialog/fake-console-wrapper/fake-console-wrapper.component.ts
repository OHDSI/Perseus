import { Component, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { WhiteRabbitScanDataConsoleComponent } from '../../shared/scan-console-wrapper/scan-data-console/white-rabbit-scan-data-console.component';

@Component({
  selector: 'app-fake-data-console-wrapper',
  templateUrl: './fake-console-wrapper.component.html',
  styleUrls: ['fake-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class FakeConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  @ViewChild(WhiteRabbitScanDataConsoleComponent)
  scanDataConsoleComponent: WhiteRabbitScanDataConsoleComponent;

  onClose() {
    this.close.emit();
  }

  onFinish(result) {
    this.result = result;
  }
}
