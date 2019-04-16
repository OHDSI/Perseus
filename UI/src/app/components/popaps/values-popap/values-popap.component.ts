import { Component } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-values-popap',
  templateUrl: './values-popap.component.html',
  styleUrls: ['./values-popap.component.scss']
})
export class ValuesPopapComponent  {
  items;

  constructor(
    private overlay: OverlayRef,
    private commonService: CommonService
  ) {
    this.overlay.backdropClick().subscribe(() => this.close());
    this.items = this.firstTenValues(this.commonService.activeRow.values);
  }

  firstTenValues(items) {
    return items.slice(0, 10);
  }

  close() {
    this.overlay.detach();
  }

}
