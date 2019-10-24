import { Component, Inject } from '@angular/core';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { IConnector } from 'src/app/models/interface/connector.interface';
import { RulesPopupComponent } from '../popaps/rules-popup/rules-popup.component';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { BRIDGE_BUTTON_DATA } from './model/bridge-button-injector';
import { BridgeButtonData } from './model/bridge-button-data';
import { ConceptService } from '../comfy/services/concept.service';
import { TransformConfigComponent } from '../vocabulary-transform-configurator/transform-config.component';

@Component({
  selector: 'app-bridge-button',
  templateUrl: './bridge-button.component.html',
  styleUrls: ['./bridge-button.component.scss']
})
export class BridgeButtonComponent {
  text = 'T';
  drawEntity: IConnector;
  active = false;

  private payloadObj: BridgeButtonData;
  private insnantiationType = {'transform' : RulesPopupComponent, 'lookup': TransformConfigComponent};
  private component: any;

  constructor(
    conceptService: ConceptService,
    private overlayService: OverlayService,
    @Inject(BRIDGE_BUTTON_DATA) payload: BridgeButtonData
  ) {
    this.payloadObj = {
      connector: payload.connector,
      arrowCache: payload.arrowCache
    };

    this.component = this.insnantiationType.transform;

    if (conceptService.isSpecial(payload.connector)) {
      this.text = 'L';
      this.component = this.insnantiationType.lookup;
    }
  }

  openRulesDialog(anchor) {
    this.payloadObj.connector.select();

    const dialogOptions: OverlayConfigOptions = {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      strategyFor: 'bridge-button',
      payload: this.payloadObj
    };

    const dialogRef = this.overlayService.open(
      dialogOptions,
      anchor,
      this.component
    );

    dialogRef.close$.subscribe(configOptions => {
      this.payloadObj.connector.deselect();
    });
  }
}
