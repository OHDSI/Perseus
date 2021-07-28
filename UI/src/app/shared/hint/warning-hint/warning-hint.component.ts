import { Component } from '@angular/core';
import { HintComponent } from '@shared/hint/hint.component';

@Component({
  selector: 'app-warning-hint',
  templateUrl: './warning-hint.component.html',
  styleUrls: [
    '../hint.component.scss',
    './warning-hint.component.scss'
  ]
})
export class WarningHintComponent extends HintComponent {
}
