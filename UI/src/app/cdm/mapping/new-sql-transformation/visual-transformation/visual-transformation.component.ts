import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { SqlFunctionForTransformation } from '@models/transformation/sql-function-for-transformation';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';
import { EditorFromTextArea } from 'codemirror';
import { initCodeMirror } from '@utils/code-mirror';
import { ReplaceTransformationFunction } from '@mapping/new-sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';
import { TransformationFunctionType } from '@models/transformation/transformation-function-type';
import { ReplaceTransformationFunctionComponent } from '@mapping/new-sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function.component';
import { createFunctionComponentAndReturnFunc } from '@mapping/new-sql-transformation/visual-transformation/visual-transformation';

@Component({
  selector: 'app-visual-transformation',
  templateUrl: './visual-transformation.component.html',
  styleUrls: ['./visual-transformation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualTransformationComponent extends BaseComponent implements AfterViewInit {
  functionTypes: TransformationFunctionType[] = [
    {
      name: 'REPLACE',
      componentClass: ReplaceTransformationFunctionComponent,
      createFunction: () => new ReplaceTransformationFunction(),
    }
  ]

  functions: SqlFunctionForTransformation[] = []

  codeMirror: EditorFromTextArea

  @ViewChild('preview')
  preview: ElementRef<HTMLTextAreaElement>

  @ViewChildren('functionContainer', {read: ViewContainerRef})
  private functionsContainers: ViewContainerRef[];

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    super()
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
  }

  addFunction() {
    this.functions.push({
      type: null,
    })
  }

  remove(index: number) {
    this.functions[index].subscription?.unsubscribe()
    this.functions = this.functions.filter((_, i) => i !== index)
  }

  onFuncChange(type: TransformationFunctionType, index: number) {
    const container = Array.from(this.functionsContainers)[index]
    const func = this.functions[index]

    func.subscription?.unsubscribe()
    func.type = type
    func.value = createFunctionComponentAndReturnFunc(type, container, this.componentFactoryResolver)
    func.subscription = func.value.change$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => this.updatePreview())
  }

  private updatePreview() {
    const functions = this.functions.filter(({type, value: func}) => type && func.valid)
    const result = functions.length === 0 ? '' : functions
      .slice()
      .reverse()
      .reduce((acc, {value: func}) => func.sql()(acc), 'value')

    this.codeMirror.setValue(result.trim())
  }
}
