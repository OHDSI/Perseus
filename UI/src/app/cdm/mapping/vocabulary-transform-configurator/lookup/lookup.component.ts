import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeleteWarningComponent } from '@popups/delete-warning/delete-warning.component';

import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/sql/sql';
import { LookupService } from '@services/lookup.service';
import { EditorFromTextArea } from 'codemirror';

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
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit, AfterViewInit {
  @Input() lookup;
  @Input() name;
  @Input() lookupType;
  @Input() notConceptTableField;

  @ViewChild('editor', { static: true }) editor;
  @ViewChild('disabledEditor', { static: true }) disabledEditor;

  items;

  selected = '';

  disabledCodeMirror: EditorFromTextArea;
  codeMirror: EditorFromTextArea;

  editMode = false;

  originText = '';

  updatedSourceToStandard = '';
  updatedSourceToSource = '';
  updatedName = '';
  withSourceToSource = true;
  userDefined = false;

  private selectDirty = false
  private codeMirrorDirty = false;

  constructor(
    private lookupService: LookupService,
    private matDialog: MatDialog) {
  }

  get sourceToSourceNotEdited() {
    return this.editMode && this.lookupType === 'source_to_source' && !this.updatedSourceToSource
  }

  get sourceToStandardNotEdited() {
    return this.editMode && this.lookupType === 'source_to_standard' && !this.updatedSourceToStandard
  }

  get dirty(): boolean {
    return this.selectDirty || this.codeMirrorDirty
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
      this.refreshCodeMirror(this.name, false);
    }
  }

  updateItems() {
    this.lookupService.getLookupsList(this.lookupType)
      .subscribe(data => this.items = [''].concat(data));
  }

  initCodeMirror() {
    if (!this.disabledCodeMirror && this.disabledEditor) {
      this.disabledCodeMirror = CodeMirror.fromTextArea(this.disabledEditor.nativeElement, {
        ...editorSettings,
        readOnly: true
      });
    }

    if (!this.codeMirror && this.editor) {
      this.codeMirror = CodeMirror.fromTextArea(this.editor.nativeElement, editorSettings);
      this.codeMirror.on('change', this.onChangeValue.bind(this));
    }
  }

  refreshCodeMirror(value, newLookupSelected?: boolean) {
    if (this.disabledCodeMirror) {
      this.lookupService.getLookupTemplate(this.lookupType)
        .subscribe(data => this.disabledCodeMirror.setValue(data));
    }

    if (this.codeMirror) {
      if (!this.editMode || this.sourceToSourceNotEdited || this.sourceToStandardNotEdited || newLookupSelected) {
        if (this.lookupType === 'source_to_standard' && this.sourceToStandardNotEdited ||
          this.lookupType === 'source_to_source' && this.sourceToSourceNotEdited) {
          value = this.lookup['originName'] ? this.lookup['originName'] : this.lookup['name'];
        }

        this.lookupService.getLookup(value, this.lookupType).subscribe(data => {
          this.codeMirror.setValue(data);
          this.subscribeOnCodeMirrorChange()
          this.originText = data;
          this.withSourceToSource = !!data;
          if (newLookupSelected) {
            this.editMode = false;
            this.updatedSourceToSource = undefined;
            this.updatedSourceToStandard = undefined;
          }
        });
        if (this.lookupType !== 'source_to_source') {
          this.lookupService.getLookup(value, 'source_to_source').subscribe(data => {
            this.withSourceToSource = !!data;
          });
        }
      } else {
        if (this.lookupType === 'source_to_source') {
          this.codeMirror.setValue(this.updatedSourceToSource);
        } else {
          this.codeMirror.setValue(this.updatedSourceToStandard);
        }
        this.subscribeOnCodeMirrorChange()
      }
      this.lookup[ 'originName' ] = value;
    }

  }

  onChangeValue(cm, event) {
    const currentValue = cm.getValue();
    if (this.originText && this.originText !== currentValue && event.origin !== 'setValue') {
      this.editMode = true;
    }

    if (this.originText === currentValue &&
      (this.lookupType === 'source_to_source' && !this.updatedSourceToStandard ||
        this.lookupType === 'source_to_standard' && !this.updatedSourceToSource)) {
      this.editMode = false;
    }

    this.lookup[ 'value' ] = currentValue;
    this.lookupType === 'source_to_standard' ?
      this.lookup[ 'source_to_standard' ] = currentValue : this.lookup[ 'source_to_source' ] = currentValue;

    if (this.editMode) {
      this.lookupType === 'source_to_standard' ? this.updatedSourceToStandard = currentValue : this.updatedSourceToSource = currentValue;
    }
  }

  onChangeName(event) {
    this.lookup['name'] = `${event.currentTarget.value}.userDefined`;
    this.updatedName = event.currentTarget.value;
  }

  isUserDefined() {
    const index = this.lookup['name'].lastIndexOf('.');
    return this.lookup['name'].substring(index + 1) === 'userDefined';
  }

  selectLookup(event) {
    this.selectDirty = true
    this.lookup['name'] = event.value;
    this.userDefined = this.isUserDefined();
    this.initCodeMirror();
    this.refreshCodeMirror(event.value, true);
    this.updatedSourceToSource = '';
    this.updatedSourceToStandard = '';
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

  lookupTypeChanged(type: any) {
    this.lookupType = type === 'source_to_standard' ? 'source_to_source' : 'source_to_standard';
    this.refreshCodeMirror(this.lookup['name']);
  }

  includeSourceToStandardChanged(event: any) {
    this.lookup['sourceToSourceIncluded'] = !this.lookup['sourceToSourceIncluded'];
  }

  private subscribeOnCodeMirrorChange() {
    this.codeMirror.on('change', this.onChangeValue.bind(this));
    const onChange = (() => {
      this.codeMirrorDirty = true
      this.codeMirror.off('change', onChange)
    })
    this.codeMirror.on('change', onChange)
  }
}
