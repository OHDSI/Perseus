import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import * as CodeMirror from 'codemirror';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
  styleUrls: [ './target-clone-dialog.component.scss', '../../sql-transformation/sql-transformation.component.scss' ]
})
export class TargetCloneDialogComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor;
  @Input() sql: {};

  chips;
  codeMirror;
  conditionForm = new FormGroup({});
  tableName = 'Test';
  condition;

  constructor(
    public dialogRef: MatDialogRef<TargetCloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  get editorContent() {
    return this.codeMirror ? this.codeMirror.getValue() : '';
  }

  ngOnInit(): void {
    this.chips = this.data.sourceTable.rows.map(item => item.name);
    this.tableName = this.data.table.cloneName ? this.data.table.cloneName : this.data.table.name;
    this.condition = this.data.table.condition;
    this.initCodeMirror();
    this.codeMirror.setValue(this.condition ? this.condition : '');
  }

  initCodeMirror() {
    this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
    this.codeMirror.on('change', this.onChange.bind(this));
    setInterval(() => { this.codeMirror.refresh(); }, 250);
  }

  drop(event: CdkDragDrop<any>) {
    const text = `{${event.item.element.nativeElement.textContent.trim()}}`;
    this.codeMirror.doc.replaceSelection(text);
    this.condition = this.editorContent;
  }

  onCancelClick() {
    this.codeMirror.setValue('');
  }

  onChange(cm, event) {
    this.condition = this.editorContent;
  }

  apply() {
    this.dialogRef.close({apply: true, condition: this.condition});
  }

}
