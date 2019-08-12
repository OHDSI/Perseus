import { Directive, HostListener, ElementRef, Input, Renderer2, OnInit, NgZone } from '@angular/core';

import { BridgeService } from 'src/app/services/bridge.service';
import { CommonService } from 'src/app/services/common.service';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { Area } from '../models/area';

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
    private commonService: CommonService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
    this.zone.runOutsideAngular(() => {
      this.elementRef.nativeElement.addEventListener(
        'dragover', this.onDragOver.bind(this)
      );

    });
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: DragEvent) {
    if (this.area !== 'source') {
      return;
    }

    const element: any = e.currentTarget;
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      this.bridgeService.sourceRow = row;
      this.bridgeService.sourceRow.htmlElement.classList.add('drag-start');
    }
  }

  onDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();

    if (this.area === 'target') {
      if (e.currentTarget.nodeName === 'TR') {
        const row = e.currentTarget;

        if (!this.bridgeService.targetRowElement) {
          this.bridgeService.targetRowElement = row;
          this.bridgeService.targetRowElement.classList.add('drag-over');
          return;
        }

        if (this.bridgeService.targetRowElement !== row) {
          this.bridgeService.targetRowElement.classList.remove('drag-over');
          this.bridgeService.targetRowElement = row;
          this.bridgeService.targetRowElement.classList.add('drag-over');
        }
      }
    }
  }

  // TODO Dont manipulate htmlElement directly
  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove('drag-start');
    }

    if (this.area !== 'target' || !this.bridgeService.sourceRow) {
      return;
    }

    const element = e.currentTarget;
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      this.bridgeService.targetRow = row;
      this.bridgeService.connect();
      this.bridgeService.reset();

      this.commonService.activeRow.connections.push(this.row);
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: DragEvent) {
    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove('drag-start');
      this.bridgeService.sourceRow = null;
    }

    if (this.bridgeService.targetRowElement) {
      this.bridgeService.targetRowElement.classList.remove('drag-over');
    }
  }
}
