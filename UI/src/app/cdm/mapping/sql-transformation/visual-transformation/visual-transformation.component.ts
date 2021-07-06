import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {
  fromState,
  SqlFunctionForTransformation,
  SqlFunctionForTransformationState,
  toState
} from '@models/transformation/sql-function-for-transformation';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { EditorFromTextArea } from 'codemirror';
import { initCodeMirror } from '@utils/code-mirror';
import { TransformationFunctionType } from '@models/transformation/transformation-function-type';
import {
  createFunctionComponentAndReturnFunction,
  defaultFunctions,
  functionTypes
} from '@mapping/sql-transformation/visual-transformation/visual-transformation';
import { ReplaySubject } from 'rxjs';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';

@Component({
  selector: 'app-visual-transformation',
  templateUrl: './visual-transformation.component.html',
  styleUrls: ['./visual-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualTransformationComponent extends BaseComponent implements AfterViewInit {

  state$ = new ReplaySubject<SqlFunctionForTransformationState[]>(1)

  functionTypes: TransformationFunctionType[] = functionTypes

  functions: SqlFunctionForTransformation[] = []

  codeMirror: EditorFromTextArea

  @ViewChild('preview')
  preview: ElementRef<HTMLTextAreaElement>

  @Input()
  sourceFields: string

  @Input()
  functionsHeight = 236

  dirty = false

  @ViewChildren('functionContainer', {read: ViewContainerRef})
  private functionsContainers: ViewContainerRef[];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private cdr: ChangeDetectorRef) {
    super()
  }

  get sql(): SqlForTransformation {
    return {
      name: this.codeMirror.getValue(),
      functions: this.functions.filter(f => f.value?.valid).map(toState),
      mode: 'visual'
    }
  }

  @Input()
  set sql({functions}: SqlForTransformation) {
    const parsed = functions && functions !== [] ? functions : defaultFunctions
    this.state$.next(parsed)
  }

  get containers() {
    return Array.from(this.functionsContainers)
  }

  ngAfterViewInit(): void {
    this.codeMirror = initCodeMirror(this.preview.nativeElement, {
      mode: 'text/x-mysql',
      lineNumbers: false,
      readOnly: true,
      addModeClass: true,
      theme: 'preview',
      lineWrapping: true
    })

    this.state$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {
        this.functions.forEach(func => func.subscription?.unsubscribe())
        this.functions = state.map(fromState)
        this.cdr.detectChanges()
        setTimeout(() => this.updateFunctions(state.map(s => s.value))) // For render template
      })
  }

  trackFuncType(index: number, item: TransformationFunctionType): string {
    return item.name
  }

  compareFuncTypes(t1: TransformationFunctionType, t2: TransformationFunctionType) {
    return t1.name === t2?.name
  }

  addFunction() {
    this.dirty = true
    this.functions = [{type: null}, ...this.functions]
  }

  remove(index: number) {
    this.functions[index].subscription?.unsubscribe()
    this.functions = this.functions.filter((_, i) => i !== index)
    this.updatePreview()
  }

  onFuncChange(type: TransformationFunctionType, index: number) {
    const container = this.containers[index]
    const func = this.functions[index]

    func.subscription?.unsubscribe()
    func.type = type

    this.initFunction(func, container)

    this.updatePreview()
  }

  private updatePreview() {
    const functions = this.functions.filter(({type, value: func}) => type && func.valid)
    const result = functions.length === 0 ? '' : functions
      .slice()
      .reverse()
      .reduce((acc, {value: func}) => func.sql()(acc), this.sourceFields)

    this.codeMirror.setValue(result.trim())
  }

  private initFunction<T>(func: SqlFunctionForTransformation<T>, container: ViewContainerRef, value?: T) {
    func.value = createFunctionComponentAndReturnFunction(func.type, container, this.componentFactoryResolver, value)
    func.subscription = func.value.change$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => this.updatePreview())
  }

  private updateFunctions<T>(values: T[]) {
    this.functions
      .filter(({type}) => type)
      .forEach((func, index) => {
        const container = this.containers[index]
        const value = values[index]
        this.initFunction(func, container, value)
      })

    this.cdr.detectChanges()
    this.updatePreview()
  }
}

