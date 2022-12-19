import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dataConnectionScanParams]',
})
export class DataConnectionScanParamsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}