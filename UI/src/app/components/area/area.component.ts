import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

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
    private matIconRegistry: MatIconRegistry,
    private bridgeService: BridgeService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
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
}
