import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/mode/sql/sql';

const editorSettings = {
  mode: 'text/x-mysql',
  lineNumbers: false,
  indentWithTabs: true,
  smartIndent: true,
  matchBrackets: true,
  autofocus: true,
  extraKeys: {'Ctrl-Space': 'autocomplete'},
  hint: CodeMirror.hint.sql,
  hintOptions: {
    tables: {
      users: {name: null, score: null, birthDate: null},
      countries: {name: null, population: null, size: null}
    }
  }
};

@Component({
  selector: 'join-tables',
  styleUrls: ['./join-tables.component.scss'],
  templateUrl: './join-tables.component.html'
})
export class JoinTablesComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<JoinTablesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @ViewChild('editor', {static: true}) editor;

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.data.tables, event.previousIndex, event.currentIndex);
  }

  ngAfterViewInit() {
    CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
  }

  setEditorContent(event) {
    // console.log(event, typeof event);
  }
}
