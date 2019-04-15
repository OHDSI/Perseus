import { Directive, HostListener, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

import { elementFromCoords } from 'src/app/utility/kit';
import { BridgeService } from 'src/app/services/bridge.service';
import { CommonService } from 'src/app/services/common.service';
import { Area } from 'src/app/components/area/area.component';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input() area: Area;
  @Input() table: ITable;
  @Input() row: IRow;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private bridgeService: BridgeService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: DragEvent) {
    if (this.area === 'target') {
      return;
    }

    const element = elementFromCoords('TR', e);
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      this.bridgeService.sourceRow = row;
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    if (!this.bridgeService.sourceRow || this.area === 'source') {
      return;
    }

    const element = elementFromCoords('TR', e);
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      this.bridgeService.targetRow = row;
      this.bridgeService.connect();
      this.bridgeService.sourceRow = null;

      this.commonService.activeRow.connections.push(this.row);
    }

  }
}


