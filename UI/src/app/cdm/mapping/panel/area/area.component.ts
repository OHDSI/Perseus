import { AfterViewInit, Component, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

import { Area } from '@models/area';
import { BridgeService } from '@services/bridge.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements AfterViewInit, OnDestroy {
  @Input() area: Area;
  @ViewChild('scrollabale', { static: true }) scrollableContent;

  private scrollUnsub: () => void

  constructor(
    private matIconRegistry: MatIconRegistry,
    private bridgeService: BridgeService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.scrollUnsub = this.renderer.listen(
      this.scrollableContent.nativeElement,
      'scroll',
      event => {
        this.bridgeService.recalculateConnectorsPositions();
      }
    );
  }

  ngOnDestroy() {
    this.scrollUnsub()
  }

  get areaIsSource() {
    return this.area === 'source';
  }
}
