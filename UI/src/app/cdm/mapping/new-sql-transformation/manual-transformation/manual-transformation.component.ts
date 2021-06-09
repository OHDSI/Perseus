import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-manual-transformation',
  templateUrl: './manual-transformation.component.html',
  styleUrls: ['./manual-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualTransformationComponent {
}
