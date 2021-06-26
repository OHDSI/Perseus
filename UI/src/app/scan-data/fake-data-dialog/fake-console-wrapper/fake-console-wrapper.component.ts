import { Component, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../auxiliary/scan-console-wrapper/abstract-console-wrapper-component.directive';
import { FakeConsoleComponent } from './fake-console/fake-console.component';

@Component({
  selector: 'app-fake-data-console-wrapper',
  templateUrl: './fake-console-wrapper.component.html',
  styleUrls: ['fake-console-wrapper.component.scss', '../../auxiliary/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class FakeConsoleWrapperComponent extends AbstractConsoleWrapperComponent<void> {

  @ViewChild(FakeConsoleComponent)
  consoleComponent: FakeConsoleComponent;
}
