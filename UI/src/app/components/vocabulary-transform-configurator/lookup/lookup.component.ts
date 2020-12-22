import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DataService } from 'src/app/services/data.service';
import { DeleteWarningComponent} from '../../popups/delete-warning/delete-warning.component';

import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/sql/sql';
import { LookupService } from '../../../services/lookup.service';

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
  @Input() lookupType;

  @ViewChild('editor', { static: true }) editor;
  @ViewChild('disabledEditor', { static: true }) disabledEditor;

  items;

  selected = '';

  codeMirror1;
  codeMirror2;

  editMode = false;

  lookupName = '';

  originText = '';

  constructor(
    private lookupService: LookupService,
    private matDialog: MatDialog) {
  }

  ngOnInit() {
    if (this.name) {
      this.selected = this.name;
    }

    this.updateItems();
  }

  ngAfterViewInit() {
    this.initCodeMirror();
    if (this.name) {
      this.refreshCodeMirror(this.name);
    }
  }

  updateItems() {
    this.lookupService.getLookupsList(this.lookupType).subscribe(data => this.items = data);
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
      this.lookupService.getLookupTemplate(this.lookupType)
        .subscribe(data => this.codeMirror1.setValue(data));
    }

    if (this.codeMirror2) {
      this.lookupService.getLookup(value, this.lookupType).subscribe(data => {
        this.codeMirror2.setValue(data);
        this.originText = data;
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
    this.lookup['name'] = `${event.currentTarget.value}.userDefined`;
  }

  selectLookup(event) {
    this.lookup['name'] = event.value;
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

    const dialog = this.matDialog.open(DeleteWarningComponent, {
      closeOnNavigation: false,
      disableClose: false,
      panelClass: 'warning-dialog',
      data: {
        title: 'Lookup',
        message: 'You want to delete lookup'
      }
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.lookupService.deleteLookup(item, this.lookupType).subscribe(_ => {
          this.updateItems();
        });
      }
    });
  }
}
