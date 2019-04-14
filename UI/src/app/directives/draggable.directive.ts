import { Directive, HostListener, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

import { DragService } from 'src/app/services/drag.service';
import { elementFromCoords } from 'src/app/utility/kit';
import { BridgeService } from 'src/app/services/bridge.service';
import { CommentsService } from './../services/comments.service';
import { CommonService } from './../services/common.service';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input() area: string;
  @Input() table: any;
  @Input() row: any;
  
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dragService: DragService,
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

    this.dragService.sourceTitle = this.area;

    const element = elementFromCoords('TR', e);
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      this.bridgeService.sourceRow = row;
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: DragEvent) {

  //   if (!this.bridgeService.sourceRow) {
  //     return;
  //   }

  // //   console.log('drop');

  //   const row = elementFromCoords('TR', e);
  //   if (row) {
  //     this.bridgeService.sourceRow.htmlElement = row;
  //     this.bridgeService.connect();
  //     this.bridgeService.sourceRow = null;
  //   }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    if (!this.bridgeService.sourceRow) {
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
      this.dragService.targetTitle = this.area;
    }
    
  }
}
