import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeleteWarningComponent } from '@popups/delete-warning/delete-warning.component';

import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/sql/sql';
import { PerseusLookupService } from '@services/perseus/perseus-lookup.service';
import { EditorFromTextArea } from 'codemirror';
import { Lookup } from '@models/perseus/lookup'
import { LookupType } from '@models/perseus/lookup-type'
import { LookupListItem } from '@models/perseus/lookup-list-item'
import { openErrorDialog, parseHttpError } from '@utils/error'

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
  @Input() lookup: Lookup;
  @Input() lookupType: LookupType;
  @Input() notConceptTableField = false;

  @ViewChild('editor', { static: true }) editor;
  @ViewChild('disabledEditor', { static: true }) disabledEditor;

  items: LookupListItem[];
  selected: LookupListItem;

  disabledCodeMirror: EditorFromTextArea;
  codeMirror: EditorFromTextArea;

  editMode = false;
  originText = '';

  updatedSourceToStandard = '';
  updatedSourceToSource = '';
  updatedName: string | null = null;
  withSourceToSource = true;
  userDefined = false;

  private selectDirty = false
  private codeMirrorDirty = false;

  constructor(
    private lookupService: PerseusLookupService,
    private matDialog: MatDialog) {
  }

  get updatedLookup(): Lookup {
    return this.lookup ? {
      ...this.lookup,
      updatedName: this.updatedName,
      lookupType: this.lookupType,
      sourceToSourceIncluded: this.withSourceToSource,
      source_to_source: this.updatedSourceToSource,
      source_to_standard: this.updatedSourceToStandard,
      isUserDefined: this.userDefined
    } : null
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

  get showPleaseSetNewName(): boolean {
    return !this.userDefined && (!this.updatedName || this.updatedName === this.lookup?.originName)
  }

  get invalid(): boolean {
    return this.editMode && this.showPleaseSetNewName
  }

  get isConceptTableField(): boolean {
    return !this.notConceptTableField
  }

  ngOnInit() {
    if (!this.lookup) {
      this.lookup = {}
    }
    if (this.lookup.name) {
      this.selected = {id: this.lookup.id, name: this.lookup.name};
      this.userDefined = this.isUserDefined(this.lookup)
    }
    this.updateItems();
  }

  ngAfterViewInit() {
    this.initCodeMirror();
    if (this.lookup.name) {
      this.lookup.originName = this.lookup.name;
      this.refreshCodeMirror(this.lookup, false, true);
    }
  }

  updateItems() {
    this.lookupService.getLookups(this.lookupType)
      .subscribe(data => this.items = [{name: ''}, ...data]);
  }

  refreshCodeMirror(value: Lookup, newLookupSelected: boolean, lookupTypeChanged: boolean = false) {
    if (lookupTypeChanged && this.disabledCodeMirror) {
      this.lookupService.getTemplateLookupSql(this.lookupType)
        .subscribe(data => this.disabledCodeMirror.setValue(data));
    }
    if (!this.codeMirror) {
      return
    }
    if (!this.editMode || this.sourceToSourceNotEdited || this.sourceToStandardNotEdited || newLookupSelected) {
      let lookupName = value.name
      const lookupId = value.id
      if (this.lookupType === 'source_to_standard' && this.sourceToStandardNotEdited || this.lookupType === 'source_to_source' && this.sourceToSourceNotEdited) {
        lookupName = this.lookup.originName ? this.lookup.originName : this.lookup.name;
      }
      const getLookupSql = value.id ?
        (type: LookupType) => this.lookupService.getLookupSqlById(lookupId, type) :
        (type: LookupType) => this.lookupService.getLookupSqlByName(lookupName, type)

      getLookupSql(this.lookupType)
        .subscribe(data => {
          this.codeMirror.setValue(data);
          this.subscribeOnCodeMirrorChange()
          this.originText = data;
          if (!this.notConceptTableField && this.lookupType === 'source_to_source') {
            this.withSourceToSource = !!data;
          }
          if (newLookupSelected) {
            this.editMode = false;
            this.updatedSourceToSource = ''
            this.updatedSourceToStandard = '';
          }
        }, getError =>
          openErrorDialog(this.matDialog, 'Failed to get lookup', parseHttpError(getError))
        );
      if (!this.notConceptTableField && this.lookupType !== 'source_to_source') {
        getLookupSql('source_to_source').subscribe(
          data => this.withSourceToSource = !!data,
          () => this.withSourceToSource = false
        );
      }
    } else {
      if (this.lookupType === 'source_to_source') {
        this.codeMirror.setValue(this.updatedSourceToSource);
      } else {
        this.codeMirror.setValue(this.updatedSourceToStandard);
      }
      this.subscribeOnCodeMirrorChange()
    }
    if (!lookupTypeChanged) {
      this.lookup.originName = this.lookup.name;
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

    this.lookup.value = currentValue;
    this.lookupType === 'source_to_standard' ?
      this.lookup.source_to_standard = currentValue : this.lookup.source_to_source = currentValue;

    if (this.editMode) {
      this.lookupType === 'source_to_standard' ? this.updatedSourceToStandard = currentValue : this.updatedSourceToSource = currentValue;
    }
  }

  onChangeName(event) {
    this.lookup.name = event.currentTarget.value;
    this.updatedName = this.lookup.name;
  }

  isUserDefined(value: Lookup): boolean {
    return !!value.id
  }

  selectLookup(event: {value: LookupListItem}) {
    this.selectDirty = true
    this.lookup = {id: event.value.id, name: event.value.name};
    this.userDefined = this.isUserDefined(this.lookup);
    this.initCodeMirror();
    this.refreshCodeMirror(this.lookup, true);
    this.updatedSourceToSource = '';
    this.updatedSourceToStandard = '';
  }

  edit(item: LookupListItem): void {
    this.editMode = true;
    this.selectLookup({value: item});
  }

  delete(id: number): void {
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
        this.lookupService.deleteLookup(id).subscribe(_ => {
          if (this.selected.id === id) {
            this.selected = {name: ''}
            this.selectLookup({value: this.selected})
          }
          this.updateItems()
        })
      }
    });
  }

  lookupTypeChanged(type: LookupType) {
    this.lookupType = type === 'source_to_standard' ? 'source_to_source' : 'source_to_standard';
    this.refreshCodeMirror(this.lookup, false, true);
  }

  includeSourceToStandardChanged() {
    this.lookup.sourceToSourceIncluded = !this.lookup.sourceToSourceIncluded;
  }

  compareSelectedItems(first: LookupListItem, second: LookupListItem): boolean {
    if (first?.id && second?.id) {
      return first.id === second.id
    } else if (first?.id || second?.id) {
      return false
    } else if (first && second) {
      return first.name === second.name
    }
  }

  refresh(): void {
    setTimeout(() => this.codeMirror?.refresh())
  }

  private initCodeMirror() {
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

  private subscribeOnCodeMirrorChange() {
    const onChange = (event => {
      this.codeMirrorDirty = true
      this.codeMirror.off('change', onChange)
    })
    this.codeMirror.on('change', onChange)
  }
}
