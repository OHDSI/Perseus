import { Component, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { FakeConsoleComponent } from './fake-console/fake-console.component';

@Component({
  selector: 'app-fake-data-console-wrapper',
  templateUrl: './fake-console-wrapper.component.html',
  styleUrls: ['fake-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class FakeConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  @ViewChild(FakeConsoleComponent)
  scanDataConsoleComponent: FakeConsoleComponent;

  onClose() {
    this.close.emit();
  }

  onFinish() {
    this.result = true;
  }
}
