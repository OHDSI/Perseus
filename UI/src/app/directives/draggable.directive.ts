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
  @Input('drag-data') data: any;
  @Input() area: string;

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

    const row = elementFromCoords('TR', e);
    if (row) {
      this.bridgeService.source = row;
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: DragEvent) {
    if (!this.bridgeService.source) {
      return;
    }

    console.log('drop');

    const row = elementFromCoords('TR', e);
    if (row) {
      this.bridgeService.target = row;
      this.bridgeService.connect();
      this.bridgeService.source = null;
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    this.commonService.activeRow.connections.push(this.data);
    this.dragService.targetTitle = this.area;
  }
}
