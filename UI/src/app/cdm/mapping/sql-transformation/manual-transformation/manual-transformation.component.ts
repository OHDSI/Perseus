import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  SQL_FUNCTIONS,
  SQL_STRING_FUNCTIONS
} from '@popups/rules-popup/transformation-input/model/sql-string-functions';
import { EditorConfiguration, EditorFromTextArea } from 'codemirror';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { initCodeMirror } from '@utils/code-mirror';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@shared/base/base.component';

const editorSettings: EditorConfiguration = {
  mode: 'text/x-mysql',
  lineNumbers: false,
  indentWithTabs: true,
  smartIndent: true,
  matchBrackets: true,
  autofocus: true,
  lineWrapping: true,
  extraKeys: { 'Ctrl-Space': 'autocomplete' },
};

@Component({
  selector: 'app-manual-transformation',
  templateUrl: './manual-transformation.component.html',
  styleUrls: ['./manual-transformation.component.scss']
})

export class ManualTransformationComponent extends BaseComponent implements AfterViewInit {

  sql$ = new ReplaySubject<SqlForTransformation>(1)

  @ViewChild('editor')
  editor: ElementRef<HTMLTextAreaElement>

  chips = SQL_STRING_FUNCTIONS;
  sqlFunctions = SQL_FUNCTIONS;

  codeMirror: EditorFromTextArea

  get sql(): SqlForTransformation {
    return {
      name: this.codeMirror.getValue(),
      mode: 'manual'
    }
  }

  @Input()
  set sql(value: SqlForTransformation) {
    this.sql$.next(value)
  }

  ngAfterViewInit() {
    this.codeMirror = initCodeMirror(this.editor.nativeElement, editorSettings)

    this.sql$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(sql => sql.name && this.codeMirror.setValue(sql.name))
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    const selectedFunction = this.sqlFunctions.filter(func => func.name === text);
    this.codeMirror.getDoc().replaceSelection(selectedFunction[0].getTemplate());
  }
}
