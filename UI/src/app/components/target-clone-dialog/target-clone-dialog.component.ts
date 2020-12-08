import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { SQL_STRING_FUNCTIONS, SQL_FUNCTIONS } from '../popups/rules-popup/transformation-input/model/sql-string-functions';
import * as CodeMirror from 'codemirror';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'app-target-clone-dialog',
  templateUrl: './target-clone-dialog.component.html',
  styleUrls: [ './target-clone-dialog.component.scss', '../sql-transformation/sql-transformation.component.scss' ]
})
export class TargetCloneDialogComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor;
  @Input() sql: {};

  chips;
  codeMirror;
  conditionForm = new FormGroup({});
  tableName = 'Test';

  constructor(
    public dialogRef: MatDialogRef<TargetCloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  get editorContent() {
    return this.codeMirror ? this.codeMirror.getValue() : '';
  }

  ngOnInit(): void {
    this.chips = this.data.table.rows.map(item => item.name);
    this.tableName = this.data.table.cloneName ? this.data.table.cloneName : this.data.table.name;
    this.initCodeMirror();
    this.codeMirror.setValue(this.data.table.condition ? this.data.table.condition : '');
  }

  initCodeMirror() {
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
    this.codeMirror.on('change', this.onChange.bind(this));
    setInterval(() => { this.codeMirror.refresh(); }, 250);
  }

  drop(event: CdkDragDrop<any>) {
    const text = event.item.element.nativeElement.textContent.trim();
    this.codeMirror.doc.replaceSelection(text);
    this.data.table.condition = this.editorContent;
  }

  onCancelClick() {
    this.codeMirror.setValue('');
  }

  onChange(cm, event) {
    this.data.table.condition = this.editorContent;
  }

  apply() {
    this.dialogRef.close();
  }

}
