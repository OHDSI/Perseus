import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightTableDirective implements OnChanges {
  @Input() values: string[];

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    const tableName = this.elementRef.nativeElement.getAttribute('criteria');
    if (this.values.findIndex(name => name === tableName) > -1) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'highlighted',
        'true'
      );
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'highlighted');
    }
  }
}
