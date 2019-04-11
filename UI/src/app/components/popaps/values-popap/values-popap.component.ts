import { Component } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-values-popap',
  templateUrl: './values-popap.component.html',
  styleUrls: ['./values-popap.component.scss']
})
export class ValuesPopapComponent  {
  items = [
    {
      value: 100
    },
    {
      value: 90
    },
    {
      value: 80
    },
    {
      value: 70
    },
    {
      value: 60
    },
    {
      value: 50
    },
    {
      value: 40
    },
    {
      value: 30
    },
    {
      value: 20
    },
    {
      value: 10
    }
  ]

  constructor(
    private overlay: OverlayRef,
    private commonService: CommonService
  ) { 
    this.overlay.backdropClick().subscribe(() => this.close());
  }

  close() {
    this.overlay.detach();
  }

}
