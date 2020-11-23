import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-scan-data-stepper',
  templateUrl: './scan-data-stepper.component.html',
  styleUrls: ['./scan-data-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: ScanDataStepperComponent }]
})
export class ScanDataStepperComponent extends CdkStepper {

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
