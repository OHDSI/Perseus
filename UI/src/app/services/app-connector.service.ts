import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';

export interface DynamicComponent {
  componentRef: ComponentRef<any>
  payload: any
}

@Injectable({
  providedIn: 'root'
})
export class AppConnectorService {

  private appComponent: ViewContainerRef

  private componentRef: DynamicComponent

  constructor() { }

  get viewContainerRef(): ViewContainerRef {
    return this.appComponent
  }

  set viewContainerRef(appComponent: ViewContainerRef) {
    this.appComponent = appComponent
  }

  get dynamicComponent(): DynamicComponent {
    return this.componentRef
  }

  set dynamicComponent(dynamicComponent: DynamicComponent) {
    this.componentRef = dynamicComponent
  }

  get isOpen() {
    return !!this.componentRef
  }
}
