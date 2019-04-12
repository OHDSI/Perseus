import { Component } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'app-rules-popup',
  templateUrl: './rules-popup.component.html',
  styleUrls: ['./rules-popup.component.scss']
})
export class RulesPopupComponent {

  constructor(private overlay: OverlayRef) {
    overlay.backdropClick().subscribe(() => this.close());
  }

  close() {
    this.overlay.detach();
  }

}
