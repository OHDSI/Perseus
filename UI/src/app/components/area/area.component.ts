import { Component, Input, ElementRef, AfterViewChecked, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { CommonService } from 'src/app/services/common.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})

export class AreaComponent implements AfterViewChecked {
  @Input() area: string;

  constructor(
    private commonService: CommonService,
    private elementRef: ElementRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private stateService: StateService
  ) {
    this.matIconRegistry
      .addSvgIcon(
        'filter',
        this.getSanitizedUrl('filter')
      )
  }

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

  get tables() {
    return this.stateService.state && this.stateService.state[this.area].tables;
  }

  getSanitizedUrl(iconName) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`);
  }

  get totalColumnsNumber() {
    return this.stateService.state &&
     this.stateService.state[this.area].tables.length;
  }

  get visibleColumnsNumber() {
    return this.stateService.state &&
     this.stateService.state[this.area].tables.filter(table => table.visible).length;
  }
}
