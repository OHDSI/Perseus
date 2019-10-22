import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges
} from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Directive({
  selector: '[concept]'
})
export class HighlightConceptDirective implements OnChanges {
  @Input('concept') tableName: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    const attributeName = 'concept';

    if (this.hasConcept(this.tableName)) {
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

  hasConcept(tablename: string): boolean {
    return (
      environment.conceptTables.findIndex(
        conceptTable => tablename.toUpperCase() === conceptTable.toUpperCase()
      ) > -1
    );
  }
}
