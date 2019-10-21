import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  OnChanges
} from '@angular/core';

const CONCEPT_TABLES = [
  'CONDITION_OCCURRENCE',
  'DEVICE_EXPOSURE',
  'DRUG_EXPOSURE',
  'MEASUREMENT',
  'OBSERVATION',
  'PROCEDURE_OCCURRENCE',
  'SPECIMEN'
];

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
      CONCEPT_TABLES.findIndex(
        conceptTable => tablename.toUpperCase() === conceptTable.toUpperCase()
      ) > -1
    );
  }
}
