import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dataConnectionSettings]',
})
export class DataConnectionSettingsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}