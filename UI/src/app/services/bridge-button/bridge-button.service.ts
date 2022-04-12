// Legacy
import { Injectable } from '@angular/core';

import { IConnector } from '@models/connector';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { TransformRulesData } from '@popups/rules-popup/model/transform-rules-data';
import { RulesPopupComponent } from '@popups/rules-popup/rules-popup.component';
import { TransformConfigComponent } from '@mapping/transform-config/transform-config.component';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { BridgeButtonData } from './model/bridge-button-data';
import { CommonService } from 'src/app/services/common.service';
import { isConceptTable } from '@utils/concept-util';

@Injectable()
export class BridgeButtonService {
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
    private overlayService: OverlayService,
    private commonService: CommonService
  ) {}

  init(payload: BridgeButtonData, element: Element) {
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
    this.ancor = element;

    if (isConceptTable(payload.connector.target.tableName)) {
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

    dialogRef.afterClosed$.subscribe((configOptions: any) => {
      const { deleted } = configOptions;
      if (!deleted) {
        this.payloadObj.connector.deselect();
      }
    });
  }
}
