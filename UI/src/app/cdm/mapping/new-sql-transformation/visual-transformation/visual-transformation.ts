import { TransformationFunctionType } from '@models/transformation/transformation-function-type';
import { ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';

export function createFunctionComponentAndReturnFunc<T>(functionType: TransformationFunctionType,
                                                        viewContainerRef: ViewContainerRef,
                                                        componentFactoryResolver: ComponentFactoryResolver): TransformationFunction<T> {
  const transformationFunction = functionType.createFunction()
  const injector = Injector.create({
    providers: [{
      provide: 'function', useValue: transformationFunction
    }]
  })

  const componentFactory = componentFactoryResolver.resolveComponentFactory(functionType.componentClass)
  const componentRef = componentFactory.create(injector);

  viewContainerRef.clear()
  viewContainerRef.insert(componentRef.hostView)

  return transformationFunction
}
