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
  extraKeys: { 'Ctrl-Space': 'autocomplete' },
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
  tableColumnsMapping;
  aliasTableMapping;
  tokenReplaceMapping = {
    join: (context) => ['left join', 'right join', 'inner join', 'outer join'],
    '*': (context) => Object.keys(this.aliasTableMapping).reduce((prev, cur) => {
      const tableName = this.aliasTableMapping[cur];
      const tableColumns = this.tableColumnsMapping[tableName].map(it => `${cur}.${it}`);
      return [...prev, ...tableColumns];
    }, [])
  };

  ngAfterViewInit() {
    this.tableColumnsMapping = this.data.tables.reduce((prev, cur) => {
      prev[cur.name] = cur.rows.map(it => it.name);
      return prev;
    }, {});
    editorSettings.hintOptions = { tables: this.tableColumnsMapping };
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
    this.codeMirror.on('cursorActivity', this.onCursorActivity.bind(this));
    this.codeMirror.on('keyup', this.onKeyUp.bind(this));
    this.codeMirror.on('change', this.onChange.bind(this));
  }

  get editorContent() {
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

  hintOptions(token) {
    const getList = this.tokenReplaceMapping[token.string];
    return {
      completeSingle: false,
      hint: () => ({
        from: token.start,
        to: token.end,
        list: getList(token)
      })
    };
  }

  joinTemplate(text) {
    const joinCount = (this.editorContent.match(/join/gi) || []).length;
    return `${this.editorContent}
      join ${text} as t${joinCount + 2} on`;
  }

  selectTemplate(text) {
    return `select * from ${text} as t1`;
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    this.codeMirror.setValue(this.editorContent ? this.joinTemplate(text) : this.selectTemplate(text));
  }

  onChange(cm, event) {
    const matches = this.editorContent.matchAll(/(from) (\w*)\b( as (\w*)\b)?| (join) (\w*)\b( as (\w*)\b)?/igm);
    if (matches) {
      this.aliasTableMapping = Array.from(matches).reduce((prev, cur) => {
        const isFrom = cur[1] && cur[1] === 'from';
        const isJoin = cur[5] && cur[5] === 'join';
        let aliasName;
        let tableName;
        if (isFrom) {
          tableName = cur[2];
          aliasName = cur[4];
        } else if (isJoin) {
          tableName = cur[6];
          aliasName = cur[8];
        }
        if (aliasName && tableName) {
          prev[aliasName] = tableName;
        }
        return prev;
      }, {});
    } else {
      this.aliasTableMapping = {};
    }
  }

  onCursorActivity(cm, event) {
    const cursor = cm.getCursor();
    const token = cm.getTokenAt(cursor);
    const hasReplaceHints = !!this.tokenReplaceMapping[token.string];
    if (hasReplaceHints) {
      cm.showHint(this.hintOptions(token) as any);
      if (cm.state.completionActive) {
        const { data: hintMenu } = cm.state.completionActive;
        CodeMirror.on(hintMenu, 'select', this.onHintSelect.bind(this));
      }
    }
  }

  onKeyUp(cm, event) {
    if (!cm.state.completionActive && event.code === 'Period') {
      cm.showHint({ completeSingle: false } as any);
    }
  }

  onHintSelect(optionSelected, element) {
    const cm = this.codeMirror;
    const cursor = cm.getCursor();
    const { line } = cursor;
    const token = cm.getTokenAt(cursor);
    cm.replaceRange(optionSelected, { line, ch: token.start }, { line, ch: token.end });
  }
}
