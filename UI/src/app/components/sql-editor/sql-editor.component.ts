import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/sql/sql';

import { Area } from '../../models/area';
import { Table } from '../../models/table';
import { CommonUtilsService } from '../../services/common-utils.service';

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
  selector: 'sql-editor',
  styleUrls: ['./sql-editor.component.scss'],
  templateUrl: './sql-editor.component.html'
})
export class SqlEditorComponent implements OnInit {
  constructor(
    private commonUtilsService: CommonUtilsService,
    public dialogRef: MatDialogRef<SqlEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @ViewChild('editor', { static: true }) editor;
  isNew = true;
  codeMirror;
  viewForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });
  chips = [];
  tablesWithoutAlias = [];
  tableColumnsMapping = {};
  aliasTableMapping = {};
  tokenReplaceMapping = {
    join: (context) => ['left join', 'right join', 'inner join', 'outer join'],
    '*': (context) => {
      const columnsWithoutAlias = this.tablesWithoutAliasColumns.map(it => it.name);
      return [...this.aliasedTablesColumns(true), ...columnsWithoutAlias];
    }
  };

  ngOnInit() {
    this.chips = this.data.tables.filter(it => !it.sql);
    this.isNew = !this.data.table;
    this.initCodeMirror();
    if (!this.isNew) {
      const { name, sql } = this.data.table;
      this.viewForm.get('name').setValue(name);
      this.codeMirror.setValue(sql);
    }
  }

  initCodeMirror() {
    const tableColumnNamesMapping = {};
    this.tableColumnsMapping = this.data.tables.reduce((prev, cur) => {
      prev[cur.name] = cur.rows;
      tableColumnNamesMapping[cur.name] = cur.rows.map(it => it.name);
      return prev;
    }, {});

    editorSettings.hintOptions = { tables: tableColumnNamesMapping };
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
    this.codeMirror.on('cursorActivity', this.onCursorActivity.bind(this));
    this.codeMirror.on('keyup', this.onKeyUp.bind(this));
    this.codeMirror.on('change', this.onChange.bind(this));
  }

  get editorContent() {
    return this.codeMirror ? this.codeMirror.getValue() : '';
  }

  get tablesWithoutAliasColumns() {
    return this.tablesWithoutAlias.reduce((prev, cur) => [...prev, ...this.tableColumnsMapping[cur]], []);
  }

  get allColumns() {
    const aliasedColumns = this.aliasedTablesColumns();
    return [...aliasedColumns, ...this.tablesWithoutAliasColumns];
  }

  get name() {
    return this.viewForm.get('name').value;
  }

  createSourceTableData() {
    const maxId = this.data.tables.reduce((a, b) => a.id > b.id ? a : b).id;
    const tableId = maxId + 1;
    const rows = this.parseColumns();
    const settings = {
      rows,
      area: Area.Source,
      expanded: false,
      id: tableId,
      name: this.name,
      visible: true,
      sql: this.editorContent
    };
    return new Table(settings);
  }

  modifySourceTableData() {
    const settings = {
      ...this.data.table,
      sql: this.editorContent,
      name: this.name
    };
    return new Table(settings);
  }

  apply() {
    if (this.isNew) {
      return this.createSourceTableData();
    }
    return this.modifySourceTableData();
  }


  aliasedTablesColumns(prefix = false) {
    return Object.keys(this.aliasTableMapping).reduce((prev, cur) => {
      const tableName = this.aliasTableMapping[cur];
      const columns = this.tableColumnsMapping[tableName];
      const tableColumns = prefix ? columns.map(it => `${cur}.${it.name}`) : columns;
      return [...prev, ...tableColumns];
    }, []);
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

  parseColumns() {
    const columnsMatch = this.editorContent.match(/select (.*\b)from\b/im);
    if (!columnsMatch) {
      return [];
    }
    const columnsRow = columnsMatch[1].trim();
    if (columnsRow === '*') {
      return this.allColumns;
    }
    return columnsRow.split(',').reduce(this.columnsReducer.bind(this), []);
  }

  columnsReducer(prev, cur) {
    const trimmed = cur.trim();
    if (trimmed) {
      const aliases = Object.keys(this.aliasTableMapping);
      const aliasPrefix = aliases.find(it => trimmed.startsWith(`${it}.`));
      if (!aliasPrefix) {
        // case if we have column name string like t2.column_name and at the same time we have no t2 alias
        return prev;
      }
      const tableName = this.aliasTableMapping[aliasPrefix];
      const columns = this.tableColumnsMapping[tableName];
      const column = columns.find(it => it.name === trimmed.slice(aliasPrefix.length + 1));
      return [...prev, column];
    }
    return prev;
  }

  selectTemplate(text) {
    return `select * from ${text} as t1`;
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    this.codeMirror.setValue(this.editorContent ? this.joinTemplate(text) : this.selectTemplate(text));
  }

  onChange(cm, event) {
    this.tablesWithoutAlias = [];
    const matches = this.editorContent.matchAll(/(from) (\w*)\b( as (\w*)\b)?| (join) (\w*)\b( as (\w*)\b)?/igm);
    this.viewForm.markAsTouched();

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
        if (!aliasName && tableName) {
          this.tablesWithoutAlias = [...this.tablesWithoutAlias, tableName];
        }
        return prev;
      }, {});
    } else {
      this.aliasTableMapping = {};
    }
  }

  onCursorActivity(cm, event) {
    this.viewForm.markAsTouched();
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

  openOnBoardingTip(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target, 'sql-editor');
  }

}
