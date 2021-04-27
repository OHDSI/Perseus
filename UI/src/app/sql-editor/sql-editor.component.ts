import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/sql/sql';
import { cloneDeep } from 'src/app/infrastructure/utility';
import { Area } from '../models/area';
import { Table } from '../models/table';
import { CommonUtilsService } from '../services/common-utils.service';
import { BridgeService } from 'src/app/services/bridge.service';
import { DataService } from 'src/app/services/data.service';
import { Row, RowOptions } from 'src/app/models/row';
import { ErrorPopupComponent } from '../popups/error-popup/error-popup.component';
import { StoreService } from '../services/store.service';

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
  styleUrls: [ './sql-editor.component.scss' ],
  templateUrl: './sql-editor.component.html'
})
export class SqlEditorComponent implements OnInit, AfterViewChecked {
  constructor(
    private commonUtilsService: CommonUtilsService,
    public dialogRef: MatDialogRef<SqlEditorComponent>,
    private cdRef: ChangeDetectorRef,
    private bridgeService: BridgeService,
    private dataService: DataService,
    private matDialog: MatDialog,
    private storeService: StoreService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @ViewChild('editor', { static: true }) editor;
  isNew = true;
  tables: any;
  table: any;
  codeMirror;
  viewForm = new FormGroup({
    name: new FormControl('', Validators.compose(
      [ Validators.maxLength(50), Validators.required ]))
  });
  chips = [];
  tablesWithoutAlias = [];
  tableColumnsMapping = {};
  aliasTableMapping = {};
  tokenReplaceMapping = {
    join: (context) => [ 'left join', 'right join', 'inner join', 'outer join' ],
    '*': (context) => {
      const columnsWithoutAlias = this.tablesWithoutAliasColumns.map(it => it.name);
      return [ ...this.aliasedTablesColumns(true), ...columnsWithoutAlias ];
    }
  };

  ngOnInit() {
    this.chips = this.data.tables.filter(it => !it.sql);
    this.isNew = !this.data.table;
    this.tables = cloneDeep(this.data.tables);
    this.table = { ...this.data.table };
    this.initCodeMirror();
    if (!this.isNew) {
      const { name, sql } = this.table;
      this.viewForm.get('name').setValue(name);
      this.codeMirror.setValue(sql);
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  initCodeMirror() {
    const tableColumnNamesMapping = {};
    this.tableColumnsMapping = this.tables.reduce((prev, cur) => {
      prev[ cur.name ] = cur.rows;
      tableColumnNamesMapping[ cur.name ] = cur.rows.map(it => it.name);
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
    return this.tablesWithoutAlias.reduce((prev, cur) => [ ...prev, ...this.tableColumnsMapping[ cur ] ], []);
  }

  get allColumns() {
    const aliasedColumns = this.aliasedTablesColumns();
    return [ ...aliasedColumns, ...this.tablesWithoutAliasColumns ];
  }

  get name() {
    return this.viewForm.get('name').value;
  }

  createSourceTableData() {
    const viewTableId = this.isNew ? (this.tables.reduce((a, b) => a.id > b.id ? a : b).id) + 1 : this.table.id;
    let viewSql = this.editorContent.replace(/^(\r\n)|(\n)/gi, ' ').replace(/\s\s+/g, ' ');
    viewSql = this.handleSelectAllCases(viewSql);

    const viewResultColumns = [];

    this.dataService.getView({ sql: viewSql }).subscribe(res => {
      res.forEach((row, index) => {
        const rowOptions: RowOptions = {
          id: index,
          tableId: viewTableId,
          tableName: this.name,
          name: row.name,
          type: row.type,
          isNullable: true,
          comments: [],
          uniqueIdentifier: false,
          area: Area.Source
        };
        const viewRow = new Row(rowOptions);
        viewResultColumns.push(viewRow);
      });
      const settings = {
        rows: viewResultColumns,
        area: Area.Source,
        id: viewTableId,
        name: this.name,
        sql: viewSql
      };
      const newTable = new Table(settings);
      this.removeLinksForDeletedRows(newTable);
      this.dialogRef.close(newTable);
    },
      error => {
        const dialog = this.matDialog.open(ErrorPopupComponent, {
          closeOnNavigation: false,
          disableClose: false,
          data: {
            title: 'View error',
            message: error.error.message
          }
        });
      });
  }

  handleSelectAllCases(viewSql: string) {
    if (this.editorContent.match(/select \*/gi)) {
      const columns = [];
      Object.keys(this.aliasTableMapping).forEach(item => {
        this.createColumnAliases(item, columns);
      });
      const allColumns = columns.join(',')
      viewSql = viewSql.replace(/select \*/gi, `select ${allColumns}`)
    } else {
      const totalColumns = [];
      Object.keys(this.aliasTableMapping).forEach(item => {
        const columns = [];
        const matchPattern = `${item}\\.\\*`
        const re = new RegExp(matchPattern, 'gi');
        if (this.editorContent.match(re)) {
          this.createColumnAliases(item, columns, totalColumns);
          const allColumns = columns.join(',')
          viewSql = viewSql.replace(re, allColumns)
        }
      })
    }
    return viewSql;
  }

  createColumnAliases(tableAlias: string, columns: any, totalColumns?: any){
    const tableName = this.aliasTableMapping[ tableAlias ];
    const table = this.storeService.state.source.find(it => it.name === tableName);
    let duplicateColumns;
    table.rows.forEach(row => {
      duplicateColumns = totalColumns ? totalColumns : columns
      const columnName = !duplicateColumns.find(col => col.substring(col.indexOf(".") + 1) === row.name) ?
      `${tableAlias}.${row.name}` :
      `${tableAlias}.${row.name} AS ${row.name}_${tableName}`;
      if(totalColumns){
        totalColumns.push(columnName)
      }
      columns.push(columnName)
    })
  }

  removeLinksForDeletedRows(newTable: Table) {
    Object.keys(this.bridgeService.arrowsCache).forEach(key => {
      const arrowSourceTableId = Number(key.substr(0, key.indexOf('-')));
      if (arrowSourceTableId === newTable.id) {
        const arrowSourceRowId = Number(key.substring(key.indexOf('-') + 1, key.indexOf('/')));
        if (newTable.rows[ arrowSourceRowId ].name !== this.bridgeService.arrowsCache[ key ].source.name) {
          this.bridgeService.deleteArrow(key, true);
        }
      }
    });
  }

  modifySourceTableData() {
    const settings = {
      ...this.table,
      sql: this.editorContent,
      name: this.name
    };
    return new Table(settings);
  }

  apply() {
    this.createSourceTableData();
  }

  aliasedTablesColumns(prefix = false) {
    return Object.keys(this.aliasTableMapping).reduce((prev, cur) => {
      const tableName = this.aliasTableMapping[ cur ];
      const columns = this.tableColumnsMapping[ tableName ];
      const tableColumns = prefix ? columns.map(it => `${cur}.${it.name}`) : columns;
      return [ ...prev, ...tableColumns ];
    }, []);
  }

  joinTemplate(text) {
    const joinCount = (this.editorContent.match(/join/gi) || []).length;
    return `${this.editorContent}
      join ${text} as t${joinCount + 2} on`;
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
      const tableName = this.aliasTableMapping[ aliasPrefix ];
      const columns = this.tableColumnsMapping[ tableName ];
      if (trimmed.slice(aliasPrefix.length + 1) === '*') {
        return columns;
      }
      const column = columns.find(it => it.name === trimmed.slice(aliasPrefix.length + 1));
      return [ ...prev, column ];
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
    const matches = this.editorContent.replace(/^(\r\n)|(\n)/gi, ' ').replace(/\s\s+/g, ' ')
      .matchAll(/(from) (\w*)\b( as (\w*)\b)?| (join) (\w*)\b( as (\w*)\b)?/igm);
    this.viewForm.markAsTouched();

    if (matches) {
      this.aliasTableMapping = Array.from(matches).reduce((prev, cur) => {
        const isFrom = cur[ 1 ] && cur[ 1 ] === 'from';
        const isJoin = cur[ 5 ] && cur[ 5 ] === 'join';
        let aliasName;
        let tableName;
        if (isFrom) {
          tableName = cur[ 2 ];
          aliasName = cur[ 4 ];
        } else if (isJoin) {
          tableName = cur[ 6 ];
          aliasName = cur[ 8 ];
        }
        if (aliasName && tableName) {
          prev[ aliasName ] = tableName;
        }
        if (!aliasName && tableName) {
          this.tablesWithoutAlias = [ ...this.tablesWithoutAlias, tableName ];
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
    const hasReplaceHints = !!this.tokenReplaceMapping[ token.string ];
    if (hasReplaceHints) {
      cm.showHint(this.hintOptions(token, cursor) as any);
    }
  }

  onKeyUp(cm, event) {
    if (!cm.state.completionActive && event.code === 'Period') {
      cm.showHint({ completeSingle: false } as any);
    }
  }

  hintOptions(token, cursor) {
    const getList = this.tokenReplaceMapping[ token.string ];
    return {
      completeSingle: false,
      hint: () => ({
        from: {line: cursor.line, ch: token.start },
        to: {line: cursor.line, ch: token.end },
        list: getList(token)
      })
    };
  }

  openOnBoardingTip(target: EventTarget) {
    this.commonUtilsService.openOnBoardingTip(target, 'sql-editor');
  }

  viewNameExists() {
    if (this.tables) {
      return (this.tables.findIndex((item: any) => item.name.toUpperCase() === this.name.toUpperCase()) !== -1 &&
        this.data.action === 'Create');
    }
    return false;
  }

}
