import { Component, Inject } from '@angular/core';

import { OVERLAY_DIALOG_DATA } from '@services/overlay/overlay-dialog-data';
import { OverlayDialogRef } from '@services/overlay/overlay.service';
import { ON_BOARDING_META } from './on-boarding.meta';

@Component({
  selector: 'on-boarding',
  styleUrls: ['./on-boarding.component.scss'],
  templateUrl: './on-boarding.component.html'
})
export class OnBoardingComponent {
  meta;
  commands = {
    close: () => this.dialogRef.close()
  };

  constructor(public dialogRef: OverlayDialogRef,
              @Inject(OVERLAY_DIALOG_DATA) public data: any) {
    this.meta = ON_BOARDING_META.find(it => it.key === data.key);
  }

  execute() {
    const execFunction = this.commands[this.meta.action.key];
    execFunction();
  }
}
