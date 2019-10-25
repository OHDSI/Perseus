import { Component, Inject, ElementRef } from '@angular/core';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { IConnector } from 'src/app/models/interface/connector.interface';
import { RulesPopupComponent } from '../popaps/rules-popup/rules-popup.component';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { BRIDGE_BUTTON_DATA } from './model/bridge-button-injector';
import { BridgeButtonData } from './model/bridge-button-data';
import { ConceptService } from '../comfy/services/concept.service';
import { TransformConfigComponent } from '../vocabulary-transform-configurator/transform-config.component';
import { TransformRulesData } from '../popaps/rules-popup/model/transform-rules-data';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-bridge-button',
  templateUrl: './bridge-button.component.html',
  styleUrls: ['./bridge-button.component.scss']
})
export class BridgeButtonComponent {
  text = 'T';
  drawEntity: IConnector;
  active = false;

  private payloadObj: TransformRulesData;
  private insnantiationType = {
    transform: RulesPopupComponent,
    lookup: TransformConfigComponent
  };
  private component: any;

  private dialogOptions: OverlayConfigOptions;
  private ancor: any;

  constructor(
    conceptService: ConceptService,
    private overlayService: OverlayService,
    @Inject(BRIDGE_BUTTON_DATA) payload: BridgeButtonData,
    private elementRef: ElementRef,
    private commonService: CommonService,
  ) {
    this.payloadObj = {
      connector: payload.connector,
      arrowCache: payload.arrowCache
    };

    this.dialogOptions = {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'transformation-unit',
      positionStrategyFor: 'simple-transform',
      payload: this.payloadObj
    };

    this.component = this.insnantiationType.transform;
    this.ancor = this.elementRef.nativeElement;

    if (conceptService.isSpecial(payload.connector)) {
      this.text = 'L';
      this.component = this.insnantiationType.lookup;
      this.dialogOptions.positionStrategyFor = 'advanced-transform';
      this.ancor = this.commonService.mappingElement.nativeElement;
    }
  }

  openRulesDialog() {
    this.payloadObj.connector.select();

    const dialogRef = this.overlayService.open(
      this.dialogOptions,
      this.ancor,
      this.component
    );

    dialogRef.close$.subscribe(configOptions => {
      this.payloadObj.connector.deselect();
    });
  }
}
