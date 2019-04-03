import { Component, Input, ElementRef, AfterViewChecked } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],

})

export class AreaComponent implements AfterViewChecked {
  @Input() area: string;

  constructor(
    private commonService: CommonService,
    private elementRef: ElementRef
  ) {}

  ngAfterViewChecked() {
    // we need to set width of areas so that we could calculate position of a BridgeButton component.
    const element = this.elementRef.nativeElement;
    if (element.offsetWidth) {
      this.commonService.setAreaWidth(this.area, element.offsetWidth);
    }
  }

  get areaIsSource() {
    return this.area === 'source';
  }
}
