import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { DataService } from 'src/app/services/data.service';

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

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LookupComponent implements OnInit, AfterViewInit {
  @Input() lookup;
  @Input() name;

  @ViewChild('editor', { static: true }) editor;
  @ViewChild('disabledEditor', { static: true }) disabledEditor;

  items;

  selected = '';

  codeMirror1;
  codeMirror2;

  editMode = false;

  lookupName = '';

  originText = '';

  lookupType = '';

  constructor(private dataService: DataService) {
    this.updateItems();
  }

  ngOnInit() {
    if (this.name) {
      this.selected = this.name;
    }
  }

  ngAfterViewInit() {
    this.initCodeMirror();
    if (this.name) {
      this.refreshCodeMirror(this.name);
    }
  }

  updateItems() {
    this.dataService.getLookupsList().subscribe(data => this.items = data);
  }

  initCodeMirror() {
    if (!this.codeMirror1 && this.disabledEditor) {
      this.codeMirror1 = CodeMirror.fromTextArea(this.disabledEditor.nativeElement, editorSettings as any);
      this.codeMirror1.options.readOnly = true;
    }

    if (!this.codeMirror2 && this.editor) {
      this.codeMirror2 = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings as any);
      this.codeMirror2.on('change', this.onChangeValue.bind(this));
    }
  }

  refreshCodeMirror(value) {
    if (this.codeMirror1) {
      this.dataService.getLookup(`template_${value.split('.')[ 0] }`).subscribe(data => this.codeMirror1.setValue(data));
    }

    if (this.codeMirror2) {
      this.dataService.getLookup(value).subscribe(data => {
        this.codeMirror2.setValue(data);
        this.originText = data;
        this.lookupType = value.split('.')[ 0 ];
        this.lookup[ 'originName' ] = value;
      });
    }
  }

  onChangeValue(cm, event) {
    const currentValue = cm.getValue();
    if (this.originText && this.originText !== currentValue && event.origin !== 'setValue') {
      this.editMode = true;
    }

    if (this.originText === currentValue) {
      this.editMode = false;
    }

    this.lookup['value'] = currentValue;
  }

  onChangeName(event) {
    this.lookup['name'] = `${this.lookupType}.${event.currentTarget.value}.userDefined`;
  }

  selectLookup(event) {
    this.initCodeMirror();
    this.refreshCodeMirror(event.value);
  }

  edit(event, item) {
    this.editMode = true;
    this.selectLookup({value: item});
  }

  delete(event, item, index) {
    event.stopPropagation();
    event.preventDefault();
    this.dataService.deleteLookup(item).subscribe();
    this.updateItems();
  }
}
