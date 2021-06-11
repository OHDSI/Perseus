import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {
  SQL_FUNCTIONS,
  SQL_STRING_FUNCTIONS
} from '@popups/rules-popup/transformation-input/model/sql-string-functions';
import { EditorConfiguration } from 'codemirror';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BridgeService } from 'src/app/services/bridge.service';
import { initCodeMirror } from '@utils/code-mirror';
import { SqlForTransformation } from '@models/transformation/sql-for-transformation';

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
  selector: 'app-sql-transformation',
  templateUrl: './sql-transformation.component.html',
  styleUrls: ['./sql-transformation.component.scss']
})

export class SqlTransformationComponent implements AfterViewInit {

  @ViewChild('editor', { static: true }) editor;

  @Input() sql: SqlForTransformation;
  @Input() reducedSqlField: boolean

  chips = SQL_STRING_FUNCTIONS;
  sqlFunctions = SQL_FUNCTIONS;
  codeMirror

  constructor(
    private bridgeService: BridgeService
  ) { }

  get editorContent() {
    return this.codeMirror ? this.codeMirror.getValue() : '';
  }

  ngAfterViewInit() {
    this.codeMirror = initCodeMirror(this.editor.nativeElement, editorSettings)
    this.codeMirror.on('change', this.onChange.bind(this));
    const name = this.sql.name
    if (name) {
      this.codeMirror.doc.replaceSelection(name);
    }
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    const selectedFunction = this.sqlFunctions.filter(func => func.name === text );
    this.codeMirror.doc.replaceSelection(selectedFunction[0].getTemplate());
    this.sql['name'] = this.editorContent;
  }

  onChange() {
    this.sql['name'] = this.editorContent;
    this.bridgeService.changeConceptSql(this.sql['name']);
  }

  setConceptSqlValue(sqlTransformation: string) {
    this.codeMirror.setValue(sqlTransformation);
  }
}
