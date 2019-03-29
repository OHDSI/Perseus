import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

import { DragService } from 'src/app/services/drag.service';
import { DrawService } from 'src/app/services/draw.service';
import { elementFromCoords } from 'src/app/utility/kit';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  @Input('drag-data') data: any;
  @Input('area') area: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private dragService: DragService, private drawService: DrawService) { }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'draggable', 'true');
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(e: DragEvent) {
    this.dragService.sourceTitle = this.area;

    const row = elementFromCoords('TR', e);
    if (row) {
      this.drawService.source = row;
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(e: DragEvent) {
    if (this.dragService.sourceEqualsTarget()) {
      return;
    }

    const row = elementFromCoords('TR', e);
    if (row) {
      this.drawService.target = row;
      this.drawService.connectPoints();
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
