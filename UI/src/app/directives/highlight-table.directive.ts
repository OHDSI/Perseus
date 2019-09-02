import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges
} from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements OnChanges {
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
