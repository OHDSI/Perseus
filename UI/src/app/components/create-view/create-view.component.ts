import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
  hintOptions: {}
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

  @ViewChild('name', { static: true }) name: ElementRef;
  @ViewChild('editor', { static: true }) editor;
  codeMirror;
  hintIsShown = false;

  ngAfterViewInit() {
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
    this.codeMirror.on('cursorActivity', this.onCursorActivity.bind(this));
  }

  get editorContent(): string {
    return this.codeMirror ? this.codeMirror.getValue() : '';
  }

  get sourceTable() {
    const maxId = this.data.tables.reduce((a, b) => a.id > b.id ? a : b).id;
    return {
      area: 'source',
      expanded: false,
      id: maxId + 1,
      name: this.name.nativeElement.value,
      rows: [],
      visible: true,
      sql: this.editorContent
    };
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    const doc = this.codeMirror.getDoc();
    if (this.editorContent) {
      const joinCount = (this.editorContent.match(/join/gi) || []).length;
      doc.setValue(`${this.editorContent}
      join ${text} as t${joinCount + 2} on`);
    } else {
      doc.setValue(`select * from ${text} as t1`);
    }
  }

  onCursorActivity(cm, event) {
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);
    if (token.type === 'keyword' && token.string === 'join' && !this.hintIsShown) {
      const options = {
        hint: () => ({
          from: token.start,
          to: token.end,
          list: ['left join', 'right join', 'inner join', 'outer join']
        })
      };
      cm.showHint(options);
      this.hintIsShown = true;
      if (cm.state.completionActive) {
        const {data: hintMenu} = cm.state.completionActive;
        CodeMirror.on(hintMenu, 'select', this.onHintSelect.bind(this));
      }
    }
  }

  onHintSelect(optionSelected, element) {
    if (this.hintIsShown) {
      const cm = this.codeMirror;
      const cursor = cm.getCursor();
      const {line} = cursor;
      const token = cm.getTokenAt(cursor);
      const tokenLength = token.end - token.start;
      const rows = this.editorContent.split('\n');
      const curRowChars = rows[line].split('');
      curRowChars.splice(token.start, tokenLength, optionSelected);
      rows[line] = curRowChars.join('');
      this.codeMirror.setValue(rows.join('\n'));
      this.codeMirror.setCursor({line, ch: tokenLength + optionSelected.length});
    }
    this.hintIsShown = false;
  }
}
