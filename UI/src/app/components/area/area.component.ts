import { Component, Input, ElementRef, AfterViewChecked, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { CommonService } from 'src/app/services/common.service';
import { StateService } from 'src/app/services/state.service';
import { DrawService } from 'src/app/services/draw.service';

export type Area = 'source' | 'target';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})

export class AreaComponent implements AfterViewInit, AfterViewChecked {
  @Input() area: Area;
  @ViewChild('scrollabale') scrollableContent;

  constructor(
    private commonService: CommonService,
    private elementRef: ElementRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private stateService: StateService,
    private drawService: DrawService,
    private renderer: Renderer2
  ) {
    this.matIconRegistry
      .addSvgIcon(
        'filter',
        this.getSanitizedUrl('filter')
      )
  }

  ngAfterViewInit() {
    this.renderer.listen(this.scrollableContent.nativeElement, 'scroll', (event) => {
      if (!this.drawService.listIsEmpty()) {
        this.drawService.fixConnectorsPosition();
      }
    });
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
