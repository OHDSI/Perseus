import { Component } from '@angular/core';
// import { RulesPopupComponent } from 'src/app/components/popaps/rules-popup/rules-popup.component';
import { CommonService } from 'src/app/services/common.service';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { IConnector } from 'src/app/models/interface/connector.interface';
import { RulesPopupComponent } from '../popaps/rules-popup/rules-popup.component';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { TransformRulesData } from '../popaps/rules-popup/model/transform-rules-data';

@Component({
  selector: 'app-bridge-button',
  templateUrl: './bridge-button.component.html',
  styleUrls: ['./bridge-button.component.scss'],
  providers: [OverlayService]
})
export class BridgeButtonComponent {
  text = 'T';
  drawEntity: IConnector;
  private payloadObj: TransformRulesData;

  constructor(
    private overlayService: OverlayService,
    private commonService: CommonService
  ) {
    this.payloadObj = {
      criteria: []
    };
  }

  get active() {
    if (this.commonService.activeConnector) {
      return this.drawEntity.id === this.commonService.activeConnector.id;
    }
  }

  openRulesDialog(anchor) {
    this.commonService.activeConnector = this.drawEntity;

    const component = RulesPopupComponent;

    const dialogOptions: OverlayConfigOptions = {
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      strategyFor: 'bridge-button',
      payload: this.payloadObj
    };

    const dialogref = this.overlayService.open(
      dialogOptions,
      anchor,
      component
    );

    console.log(this.payloadObj);
  }
}
