import { Component } from '@angular/core';
//import { RulesPopupComponent } from 'src/app/components/popaps/rules-popup/rules-popup.component';
import { CommonService } from 'src/app/services/common.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { IConnector } from 'src/app/models/interface/connector.interface';
import { RulesPopupComponent } from '../popaps/rules-popup/rules-popup.component';

@Component({
  selector: 'app-bridge-button',
  templateUrl: './bridge-button.component.html',
  styleUrls: ['./bridge-button.component.scss'],
  providers: [OverlayService]
})
export class BridgeButtonComponent {
  text = 'T';
  drawEntity: IConnector;

  constructor(
    private overlayService: OverlayService,
    private commonService: CommonService
    ) { }

  get active() {
    if (this.commonService.activeConnector) {
      return this.drawEntity.id === this.commonService.activeConnector.id;
    }
  }

  openRulesDialog(anchor) {
    this.commonService.activeConnector = this.drawEntity;

    const component = RulesPopupComponent;

    this.overlayService.openDialog(anchor, component, 'bridge-button');
  }
}
