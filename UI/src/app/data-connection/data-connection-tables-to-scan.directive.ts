import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dataConnectionTablesToScan]',
})
export class DataConnectionTablesToScanDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}