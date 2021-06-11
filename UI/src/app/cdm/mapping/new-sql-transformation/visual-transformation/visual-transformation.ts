import { TransformationFunctionType } from '@models/transformation/transformation-function-type';
import { ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { TransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/transformation-function';
import { ReplaceTransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function.component';
import { ReplaceTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';
import { DatePartTransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function.component';
import { DatePartTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function';
import { DateAddTransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function.component';
import { DateAddTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function';
import { SwitchCaseTransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function.component';
import { SwitchCaseTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function';
import { NoArgsTransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/no-args-transformation-function/no-args-transformation-function.component';
import { TrimTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/no-args-transformation-function/function/trim-transformation-function';
import { UpperTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/no-args-transformation-function/function/upper-transformation-function';
import { LowerTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/no-args-transformation-function/function/lower-transformation-function';

export function createFunctionComponentAndReturnFunction<T>(functionType: TransformationFunctionType,
                                                            viewContainerRef: ViewContainerRef,
                                                            componentFactoryResolver: ComponentFactoryResolver,
                                                            value?: T): TransformationFunction<T> {
  const transformationFunction = functionType.createFunction(value)
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

export const functionTypes: TransformationFunctionType[] = [
  {
    name: 'REPLACE',
    componentClass: ReplaceTransformationFunctionComponent,
    createFunction: (value?) => new ReplaceTransformationFunction(value),
  },
  {
    name: 'DATEPART',
    componentClass: DatePartTransformationFunctionComponent,
    createFunction: (value?) => new DatePartTransformationFunction(value)
  },
  {
    name: 'DATEADD',
    componentClass: DateAddTransformationFunctionComponent,
    createFunction: (value?) => new DateAddTransformationFunction(value)
  },
  {
    name: 'CASE',
    componentClass: SwitchCaseTransformationFunctionComponent,
    createFunction: (value?) => new SwitchCaseTransformationFunction(value)
  },
  {
    name: 'TRIM',
    componentClass: NoArgsTransformationFunctionComponent,
    createFunction: (value?) => new TrimTransformationFunction(value)
  },
  {
    name: 'UPPER',
    componentClass: NoArgsTransformationFunctionComponent,
    createFunction: (value?) => new UpperTransformationFunction(value)
  },
  {
    name: 'LOWER',
    componentClass: NoArgsTransformationFunctionComponent,
    createFunction: (value?) => new LowerTransformationFunction(value)
  }
]
