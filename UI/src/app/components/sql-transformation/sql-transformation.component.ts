import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SQL_STRING_FUNCTIONS, SQL_FUNCTIONS } from '../popups/rules-popup/transformation-input/model/sql-string-functions';
import * as CodeMirror from 'codemirror';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormGroup } from '@angular/forms';
import { IConnector } from 'src/app/models/interface/connector.interface';

const editorSettings = {
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

export class SqlTransformationComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor;
  @Input() sql: {};

  chips = SQL_STRING_FUNCTIONS;
  sqlFunctions = SQL_FUNCTIONS;
  codeMirror;
  sqlForm = new FormGroup({});

  constructor() { }

  get editorContent() {
    return this.codeMirror ? this.codeMirror.getValue() : '';
  }

  ngOnInit(): void {
    this.sql['sql'] = true;
    this.initCodeMirror();
    this.codeMirror.doc.replaceSelection(this.sql['name']);
  }

  initCodeMirror() {
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
    this.codeMirror.on('cursorActivity', this.onCursorActivity.bind(this));
    this.codeMirror.on('change', this.onChange.bind(this));
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    const selectedFunction = this.sqlFunctions.filter(func => func.name === text );
    this.codeMirror.doc.replaceSelection(selectedFunction[0].getTemplate());
    this.sql['name'] = this.editorContent;
  }

  onCancelClick() {
    this.codeMirror.setValue('');
  }

  onChange(cm, event) {
    this.sql['name'] = this.editorContent;
  }

  onCursorActivity(cm, event) {
   // this.sqlForm.markAsTouched();
  }

}
