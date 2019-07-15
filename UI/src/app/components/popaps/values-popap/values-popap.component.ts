import { Component } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-values-popap',
  templateUrl: './values-popap.component.html',
  styleUrls: ['./values-popap.component.scss']
})
export class ValuesPopapComponent  {
  items = [];

  constructor(
    private overlay: OverlayRef,
    private commonService: CommonService,
    private dataService: DataService
  ) {
    this.overlay.backdropClick().subscribe(() => this.close());
    this.getTopValues()
  }

  getTopValues() {
    this.dataService.getTopValues(this.commonService.activeRow).subscribe(data => this.items = data)
  }

  close() {
    this.overlay.detach();
  }

}