import { Directive, HostListener, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

import { DragService } from 'src/app/services/drag.service';
import { elementFromCoords } from 'src/app/utility/kit';
import { BridgeService } from 'src/app/services/bridge.service';

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
    private bridgeService: BridgeService
  ) { }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: DragEvent) {
    this.dragService.sourceTitle = this.area;

    const row = elementFromCoords('TR', e);
    if (row) {
      this.bridgeService.source = row;
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: DragEvent) {
    if (this.dragService.sourceEqualsTarget()) {
      return;
    }

    const row = elementFromCoords('TR', e);
    if (row) {
      this.bridgeService.target = row;
      this.bridgeService.connect();
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    this.dragService.targetTitle = this.area;
  }
}
