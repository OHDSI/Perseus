import { TransformationFunctionType } from '@models/transformation/transformation-function-type';
import { ComponentFactoryResolver, Injector, ViewContainerRef } from '@angular/core';
import { TransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/transformation-function';
import { ReplaceTransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function.component';
import { ReplaceTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';
import { DatePartTransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function.component';
import { DatePartTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function';
import { DateAddTransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function.component';
import { DateAddTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function';
import { SwitchCaseTransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function.component';
import { SwitchCaseTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function';
import { NoArgsTransformationFunctionComponent } from '@mapping/sql-transformation/visual-transformation/function/no-args-transformation-function/no-args-transformation-function.component';
import { TrimTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/no-args-transformation-function/function/trim-transformation-function';
import { UpperTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/no-args-transformation-function/function/upper-transformation-function';
import { LowerTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/no-args-transformation-function/function/lower-transformation-function';
import { SqlFunctionForTransformationState } from '@models/transformation/sql-function-for-transformation';
import { FunctionType } from '@models/transformation/function-type';
import { FieldType } from '@utils/field-type';

export function createFunctionComponentAndReturnFunction<T>(functionType: TransformationFunctionType,
                                                            viewContainerRef: ViewContainerRef,
                                                            componentFactoryResolver: ComponentFactoryResolver,
                                                            value?: T,
                                                            fieldType?: FieldType): TransformationFunction<T> {
  const transformationFunction = functionType.createFunction(value, fieldType)
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
    name: FunctionType.REPLACE,
    componentClass: ReplaceTransformationFunctionComponent,
    createFunction: (value?, type?) => new ReplaceTransformationFunction(value, type),
  },
  {
    name: FunctionType.DATEPART,
    componentClass: DatePartTransformationFunctionComponent,
    createFunction: (value?) => new DatePartTransformationFunction(value)
  },
  {
    name: FunctionType.DATEADD,
    componentClass: DateAddTransformationFunctionComponent,
    createFunction: (value?) => new DateAddTransformationFunction(value)
  },
  {
    name: FunctionType.CASE,
    componentClass: SwitchCaseTransformationFunctionComponent,
    createFunction: (value?, type?) => new SwitchCaseTransformationFunction(value, type)
  },
  {
    name: FunctionType.TRIM,
    componentClass: NoArgsTransformationFunctionComponent,
    createFunction: (value?) => new TrimTransformationFunction(value)
  },
  {
    name: FunctionType.UPPER,
    componentClass: NoArgsTransformationFunctionComponent,
    createFunction: (value?) => new UpperTransformationFunction(value)
  },
  {
    name: FunctionType.LOWER,
    componentClass: NoArgsTransformationFunctionComponent,
    createFunction: (value?) => new LowerTransformationFunction(value)
  }
]

export const defaultFunctions: SqlFunctionForTransformationState[] = [
  {
    type: null,
    value: null
  }
]
