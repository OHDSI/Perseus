import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Directive({
  selector: '[concept]'
})
export class HighlightConceptDirective implements OnChanges {
  @Input('concept') tableName: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    const attributeName = 'concept';

    if (this.isConceptTable(this.tableName)) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        attributeName,
        'true'
      );
    } else {
      this.renderer.removeAttribute(
        this.elementRef.nativeElement,
        attributeName
      );
    }
  }

  isConceptTable(tablename: string): boolean {
    return (
      environment.conceptTables.findIndex(
        conceptTable => tablename.toUpperCase() === conceptTable.toUpperCase()
      ) > -1
    );
  }
}
