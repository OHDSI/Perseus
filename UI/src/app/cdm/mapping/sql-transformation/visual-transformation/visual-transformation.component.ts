import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
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
  functionTypes
} from '@mapping/sql-transformation/visual-transformation/visual-transformation';

@Component({
  selector: 'app-visual-transformation',
  templateUrl: './visual-transformation.component.html',
  styleUrls: ['./visual-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualTransformationComponent extends BaseComponent implements OnInit, AfterViewInit {
  functionTypes: TransformationFunctionType[] = functionTypes

  functions: SqlFunctionForTransformation[]

  codeMirror: EditorFromTextArea

  @Input()
  functionsState: SqlFunctionForTransformationState[]

  @ViewChild('preview')
  preview: ElementRef<HTMLTextAreaElement>

  @Input()
  sourceFields: string

  @Input()
  functionsHeight = 236

  @ViewChildren('functionContainer', {read: ViewContainerRef})
  private functionsContainers: ViewContainerRef[];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    super()
  }

  get sql(): string {
    return this.codeMirror.getValue()
  }

  get state(): SqlFunctionForTransformationState[] {
    return this.functions.map(toState)
  }

  get containers() {
    return Array.from(this.functionsContainers)
  }

  ngOnInit(): void {
    this.functions = this.functionsState?.map(fromState) ?? []
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

    this.functions.forEach((func, index) => {
      const container = this.containers[index]
      const value = this.functionsState[index].value
      this.initFunction(func, container, value)
    })

    this.updatePreview()
  }

  addFunction() {
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
}

