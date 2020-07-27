import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';

import * as CodeMirror from 'codemirror/lib/codemirror';
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
  selector: 'create-view',
  styleUrls: ['./create-view.component.scss'],
  templateUrl: './create-view.component.html'
})
export class CreateViewComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<CreateViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @ViewChild('editor', {static: true}) editor;
  codeMirror;

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();

    const editor = this.codeMirror.getDoc();

    if (this.editorContent) {
      const joinCount = (this.editorContent.match(/join/gi) || []).length;
      editor.setValue(`${this.editorContent} \n join ${text} as t${joinCount + 2} on`);
    } else {
      editor.setValue(`select * from ${text} as t1`);
    }
  }

  ngAfterViewInit() {
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
  }

  get editorContent(): string {
    return this.codeMirror.getValue();
  }
}
