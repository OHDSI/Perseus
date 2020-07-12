import {
  Component,
  Input,
  ElementRef,
  AfterViewChecked,
  ViewChild,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import { CommonService } from 'src/app/services/common.service';
import { StateService } from 'src/app/services/state.service';
import { Area } from 'src/app/models/area';
import { BridgeService } from 'src/app/services/bridge.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements AfterViewInit {
  @Input() area: Area;
  @ViewChild('scrollabale', { static: true }) scrollableContent;

  constructor(
    private commonService: CommonService,
    private elementRef: ElementRef,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private stateService: StateService,
    private bridgeService: BridgeService,
    private renderer: Renderer2
  ) {
    this.matIconRegistry.addSvgIcon('filter', this.getSanitizedUrl('filter'));
  }

  ngAfterViewInit() {
    const element = this.elementRef.nativeElement;

    if (element.offsetWidth) {
      this.commonService.setAreaWidth(this.area, element.offsetWidth);
    }

    this.renderer.listen(
      this.scrollableContent.nativeElement,
      'scroll',
      event => {
        this.bridgeService.recalculateConnectorsPositions();
      }
    );
  }

  get areaIsSource() {
    return this.area === 'source';
  }

  get tables() {
    return this.stateService.state && this.stateService.state[this.area].tables;
  }

  getSanitizedUrl(iconName) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `assets/icons/${iconName}.svg`
    );
  }

  get totalColumnsNumber() {
    return (
      this.stateService.state &&
      this.stateService.state[this.area].tables.length
    );
  }

  get visibleColumnsNumber() {
    return (
      this.stateService.state &&
      this.stateService.state[this.area].tables.filter(table => table.visible)
        .length
    );
  }
}
