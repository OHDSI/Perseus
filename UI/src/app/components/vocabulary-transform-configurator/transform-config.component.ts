import { Component, Inject, Input, OnChanges, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Command } from 'src/app/infrastructure/command';
import { cloneDeep, uniqBy } from 'src/app/infrastructure/utility';
import { ITable } from 'src/app/models/table';
import { StateService } from 'src/app/services/state.service';
import { IVocabulary, VocabulariesService } from 'src/app/services/vocabularies.service';
import { TransformRulesData } from '../popups/rules-popup/model/transform-rules-data';
import { DictionaryItem } from '../vocabulary-search-select/model/vocabulary';
import { ConditionDialogComponent } from './condition-dialog/condition-dialog.component';
import { TransformationCondition, TransformationConfig, TransformationConfigFactory } from './model/transformation-config';
import { VocabularyConfig } from './model/vocabulary-config';
import { IConnector } from 'src/app/models/interface/connector.interface';
import { SqlTransformationComponent } from '../sql-transformation/sql-transformation.component';

@Component({
  selector: 'app-transform-config',
  templateUrl: './transform-config.component.html',
  styleUrls: [ './transform-config.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class TransformConfigComponent implements OnInit, OnChanges {
  @Input() sourceFileds: string[];
  @Input() vocabularies: IVocabulary[];
  @Input() selectedSourceFields: string[] = [];
  @Input() transformationConfigs: TransformationConfig[];

  @Input() sourceTables: ITable[]; // test

  @ViewChild('sqlTransformationTab', { static: false }) sqlTransformation: SqlTransformationComponent;

  get configurations(): DictionaryItem[] {
    return this.pconfigurations;
  }

  get transformationCondition(): TransformationCondition {
    return this.ptransformationCondition;
  }

  private ptransformationCondition: TransformationCondition;

  get conditions(): DictionaryItem[] {
    return this.pconditions;
  }

  private pconditions: DictionaryItem[];

  get selectedSourceFieldsDictionary(): DictionaryItem[] {
    return this.pselectedSourceFieldsDictionary;
  }

  private pselectedSourceFieldsDictionary: DictionaryItem[];

  configurationNameControl = new FormControl();

  private pconfigurations: DictionaryItem[];
  private transformationConfig: TransformationConfig;
  private transformationConfigFactory: TransformationConfigFactory;

  selectedCondition: DictionaryItem[];
  selectedConfiguration: DictionaryItem[];
  sourceFiledsDictionary: DictionaryItem[];

  selectedSourceFieldsForHeader: string;

  busy = false;

  titleInfo: string;
  sourceField: string[];
  targetField: string;
  connector: IConnector;

  tabs = [ 'SQL Function', 'Lookup' ];

  activeTab = 0;
  lookupName;

  lookup = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public payload: TransformRulesData,
    public dialogRef: MatDialogRef<TransformConfigComponent>,
    private snakbar: MatSnackBar,
    private addCondition: MatDialog,
    private stateService: StateService,
    vocabulariesService: VocabulariesService
  ) {
    this.activeTab = payload[ 'tabIndex' ];
    this.lookupName = payload[ 'lookupName' ];
    this.transformationConfigs = [];

    const { arrowCache, connector } = this.payload;
    const sourceFields = Object.values(arrowCache).map(row => row.connector.source.name);
    this.sourceField = sourceFields;
    this.targetField = connector.target.name;
    this.connector = connector;
    this.titleInfo = `(${sourceFields.join(', ')}) - ${connector.target.name}`;
    if (
      arrowCache[ connector.id ] &&
      arrowCache[ connector.id ].transformationConfigs
    ) {
      this.transformationConfigs = [].concat.apply(
        this.transformationConfigs,
        arrowCache[ connector.id ].transformationConfigs
      );
    }

    this.sourceTables = this.stateService.state.source.tables;
    this.vocabularies = vocabulariesService.vocabularies;

    this.selectedSourceFields = Object.values(payload.arrowCache).map(arrow => arrow.source.name);

    const selectedSourceTablesNames = Object.values(payload.arrowCache).map(arrow => ({ name: arrow.source.tableName }));

    const newSelectedSourceTablesNames = uniqBy(selectedSourceTablesNames, 'name').map(x => x.name);

    if (this.sourceTables) {
      this.sourceFileds = this.sourceTables
        .filter(sourceTable => newSelectedSourceTablesNames.includes(sourceTable.name))
        .map(table => table.rows)
        .reduce((p, k) => p.concat.apply(p, k), [])
        .map(t => t.name);
    }
  }

  create = new Command({
    execute: () => {
      const configName = this.configurationNameControl.value;
      this.transformationConfig = this.transformationConfigFactory.createNew(
        configName,
        this.selectedSourceFields
      );

      this.transformationConfigs.push(this.transformationConfig);

      console.log(
        'Created configuration',
        this.transformationConfig.conditions[ 0 ].vocabularyConfig.conceptConfig
      );

      this.snakbar.open(
        `Configuration "${this.configurationNameControl.value}" has been created`,
        ' DISMISS ',
        { duration: 3000 }
      );

      this.configurationNameControl.reset();

      this.updateConfigurations();

      this.selectedConfiguration = [ new DictionaryItem(this.transformationConfig.name) ];

      // Select default condition of the new configuration
      this.selectTransformationCondition(this.transformationConfig.conditions[ 0 ].name);
    },
    canExecute: () => this.configurationNameControl.valid
  });

  apply = new Command({
    execute: () => {
      const configCopy: TransformationConfig = cloneDeep(this.transformationConfig);

      // TODO Update existed
      const idx = this.transformationConfigs.findIndex(config => config.name === configCopy.name);
      if (idx > -1) {
        this.transformationConfigs[ idx ] = configCopy;
      }

      const { arrowCache, connector } = this.payload;
      if (arrowCache[ connector.id ]) {
        arrowCache[ connector.id ].transformationConfigs = this.transformationConfigs;
      }

      console.log(
        'Saved configuration',
        configCopy.conditions[ 0 ].vocabularyConfig.conceptConfig
      );

      this.updateConfigurations();

      this.snakbar.open(
        `Configuration "${this.transformationConfig.name}" has been saved`,
        ' DISMISS ',
        { duration: 3000 }
      );
    },
    canExecute: () => true
  });

  delete = new Command({
    execute: () => {},
    canExecute: () => true
  });

  close = new Command({
    execute: () => {
      this.dialogRef.close();
    },
    canExecute: () => true
  });

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  trackByFn(index, item) {
    return index;
  }

  onTabIndexChanged(index: number) {
    this.activeTab = index;
  }

  add() {
    if (this.activeTab === 0) {
      this.connector.source.sqlTransformation = this.sqlTransformation.editorContent;
      this.connector.source.sqlTransformationActive = this.sqlTransformation.editorContent ? true : false;
      this.dialogRef.close();
    } else {
      this.dialogRef.close(this.lookup);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  init() {
    if (this.selectedSourceFields) {
      this.selectedSourceFieldsForHeader = this.selectedSourceFields.join(',');
    }

    if (this.sourceFileds) {
      this.sourceFiledsDictionary = this.sourceFileds.map(name => new DictionaryItem(name));
    }

    if (this.vocabularies) {
      if (!this.transformationConfigFactory) {
        this.transformationConfigFactory = new TransformationConfigFactory(this.vocabularies);
        this.transformationConfig = this.transformationConfigFactory.createNew(
          'default',
          this.selectedSourceFields
        );
      }

      this.updateConfigurations();
      this.updateSelectedSourceFields();
      this.updateConditionsVariable();
      this.setLastAddedTransformatioNCondition();
      this.selectTransformationCondition(this.transformationConfig.conditions[ 0 ].name);

      setTimeout(() => {
        if (this.selectedSourceFields) {
          this.pselectedSourceFieldsDictionary = this.selectedSourceFields.map(sorceFieldName => new DictionaryItem(sorceFieldName));
        }
      });
    }
  }

  onConfigurationSelected(vocabulary: IVocabulary) {
    if (!this.configurationNameControl.valid && !vocabulary) {
      return;
    } else if (vocabulary) {
      const index = this.transformationConfigs.findIndex(l => l.name === vocabulary.name);
      if (index > -1) {
        this.transformationConfig = this.transformationConfigs[ index ];

        this.selectTransformationCondition(this.transformationConfig.conditions[ 0 ].name);
      }
    }
  }

  onConditionSelected(event: any) {
    if (!event) {
      return;
    }

    const conditionName = event.name;
    const condition = this.transformationConfig.conditions.find(c => c.name === conditionName);

    if (condition) {
      this.updateConditionsVariable();
      this.selectTransformationCondition(conditionName);
      this.selectedCondition = [ new DictionaryItem(conditionName) ];
    }
  }

  openConditionsDialog() {
    const data = {
      sourceFields: this.sourceFileds,
      config: this.transformationConfig,
      result: null
    };

    const dialogRef = this.addCondition.open(ConditionDialogComponent, { data });

    dialogRef.afterClosed().subscribe(_ => {
      const { result } = data;
      const name = `${result.field} ${result.operator} ${result.criteria}`;
      const condition: TransformationCondition = {
        name,
        sourceField: result.field,
        criteria: result.criteria,
        operator: result.operator,
        vocabularyConfig: new VocabularyConfig(this.vocabularies)
      };

      this.transformationConfig.conditions.push(condition);

      this.updateConditionsVariable();
      this.setLastAddedTransformatioNCondition();
      this.selectedCondition = [ new DictionaryItem(name) ];
    });
  }

  updateTransformationCondition(event: TransformationCondition) {
    const index = this.transformationConfig.conditions.findIndex(condition => condition.name === event.name);
    if (index > -1) {
      this.transformationConfig.conditions[ index ] = event;
      this.ptransformationCondition = this.transformationConfig.conditions[ index ];
    }
  }

  private updateConfigurations() {
    const hash = new Set<string>();
    this.transformationConfigs.forEach(e => hash.add(e.name));
    this.pconfigurations = Array.from(hash.values()).map(e => new DictionaryItem(e));
  }

  private updateConditionsVariable() {
    this.pconditions = this.transformationConfig.conditions.map(c => new DictionaryItem(c.name));
  }

  private updateSelectedSourceFields() {
    this.pselectedSourceFieldsDictionary = this.transformationConfig.selectedSourceFields.map(c => new DictionaryItem(c));
  }

  private setLastAddedTransformatioNCondition() {
    this.ptransformationCondition = this.transformationConfig.conditions[ this.transformationConfig.conditions.length - 1 ];
  }

  private selectTransformationCondition(name: string) {
    const index = this.transformationConfig.conditions.findIndex(condition => condition.name === name);
    if (index > -1) {
      this.ptransformationCondition = this.transformationConfig.conditions[ index ];
      this.selectedCondition = [ new DictionaryItem(this.ptransformationCondition.name) ];
      this.updateConditionsVariable();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
