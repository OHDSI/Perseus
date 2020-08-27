import { Component, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';

// TODO: refactoring
import { HttpClient } from '@angular/common/http';

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
  extraKeys: { 'Ctrl-Space': 'autocomplete' },
  hint: CodeMirror.hint.sql,
  hintOptions: {}
};

const sourceToSource = [
  'cvx',
  'icd9cm',
  'icd9proc',
  'icd10',
  'icd10cm',
  'loinc',
  'ndc',
  'nucc',
  'procedure',
  'read',
  'revenue',
  'snomed'
];
const sourceToStandard = ['cms', 'cpt4_modifier', 'ucum'].concat(sourceToSource);

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LookupComponent implements AfterViewInit {
  @ViewChild('editor', { static: true }) editor;
  @ViewChild('disabledEditor', { static: true }) disabledEditor;

  items = sourceToSource.map(item => `source_to_source.${item}`).concat(sourceToStandard.map(item => `source_to_standard.${item}`));
  selected = '';

  codeMirror1;
  codeMirror2;

  editMode = false;

  lookupName = '';

  originText = '';

  constructor(public http: HttpClient) {}

  ngAfterViewInit() {
    this.initCodeMirror();
  }

  initCodeMirror() {
    if (!this.codeMirror1 && this.disabledEditor) {
      this.codeMirror1 = CodeMirror.fromTextArea(this.disabledEditor.nativeElement, editorSettings as any);
      this.codeMirror1.options.readOnly = true;
    }

    if (!this.codeMirror2 && this.editor) {
      this.codeMirror2 = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
      this.codeMirror2.on('change', this.onChange.bind(this));
    }
  }

  refreshCodeMirror(value) {
    if (this.codeMirror1) {
      this.http.get(`assets/txt/template_${value.split('.')[0]}.txt`, {responseType: 'text'}).subscribe(data => {
        this.codeMirror1.setValue(data);
      });
    }

    if (this.codeMirror2) {
      this.http.get(`assets/txt/${value.replace('.', '/')}.txt`, {responseType: 'text'}).subscribe(data => {
        this.codeMirror2.setValue(data);
        this.originText = data;
      });
    }
  }

  onChange(cm, event) {
    if (this.originText && this.originText !== event.value) {
      this.editMode = true;
    }

    if (this.originText === event.value) {
      this.editMode = false;
    }
  }

  selectLookup(event) {
    this.initCodeMirror();
    this.refreshCodeMirror(event.value);
  }

  add() {

  }

  isNotDefault(value) {
    const valueParts = value.split('.');

    if (valueParts.length === 2 && valueParts[0] !== 'source_to_source' && valueParts[0] !== 'source_to_standard') {
      return true;
    }

    return false;
  }

  edit(event, item) {
    event.stopPropagation();
    this.editMode = true;
    this.selectLookup({value: item});
    console.log('EDIT');
  }

  delete(event, item) {
    event.stopPropagation();
    console.log('EDIT');
  }
}
