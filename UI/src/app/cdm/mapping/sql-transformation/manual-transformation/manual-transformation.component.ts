import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {
  SQL_FUNCTIONS,
  SQL_STRING_FUNCTIONS
} from '@popups/rules-popup/transformation-input/model/sql-string-functions';
import { EditorConfiguration, EditorFromTextArea } from 'codemirror';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BridgeService } from '@services/bridge.service';
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
  selector: 'app-manual-transformation',
  templateUrl: './manual-transformation.component.html',
  styleUrls: ['./manual-transformation.component.scss']
})

export class ManualTransformationComponent implements AfterViewInit {

  @ViewChild('editor', { static: true }) editor;

  @Input() sql: SqlForTransformation;

  chips = SQL_STRING_FUNCTIONS;
  sqlFunctions = SQL_FUNCTIONS;

  codeMirror: EditorFromTextArea

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
      this.codeMirror.getDoc().replaceSelection(name);
    }
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    const selectedFunction = this.sqlFunctions.filter(func => func.name === text );
    this.codeMirror.getDoc().replaceSelection(selectedFunction[0].getTemplate());
    this.sql['name'] = this.editorContent;
  }

  onChange() {
    this.sql['name'] = this.editorContent;
    this.bridgeService.changeConceptSql(this.sql['name']);
  }
}
