import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';
import {
  IVocabulary,
  VocabulariesService
} from 'src/app/services/vocabularies.service';
import { FormControl } from '@angular/forms';
import { VocabularyConfig } from './model/vocabulary-config';
import { DictionaryItem } from '../vocabulary-search-select/model/vocabulary';
import { MatSnackBar, MatDialog } from '@angular/material';
import { cloneDeep } from 'src/app/infrastructure/utility';
import {
  TransformationConfig,
  TransformationCondition,
  TransformationConfigFactory
} from './model/transformation-config';
import { Command } from 'src/app/infrastructure/command';
import { ConditionDialogComponent } from './condition-dialog/condition-dialog.component';
import { ITable } from 'src/app/models/table';
import { TransformRulesData } from '../popaps/rules-popup/model/transform-rules-data';
import { OVERLAY_DIALOG_DATA } from 'src/app/services/overlay/overlay-dialog-data';
import { StateService } from 'src/app/services/state.service';
import { switchMap, map } from 'rxjs/operators';
import { OverlayDialogRef } from 'src/app/services/overlay/overlay.service';

@Component({
  selector: 'app-transform-config',
  templateUrl: './transform-config.component.html',
  styleUrls: ['./transform-config.component.scss']
})
export class TransformConfigComponent implements OnInit, OnChanges {
  @Input() sourceFileds: string[];
  @Input() vocabularies: IVocabulary[];
  @Input() selectedSourceFields: string[] = [];
  @Input() transformationConfigs: TransformationConfig[];

  @Input() sourceTables: ITable[]; // test

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

  busy = false;

  constructor(
    @Inject(OVERLAY_DIALOG_DATA) public payload: TransformRulesData,
    private dialogRef: OverlayDialogRef,
    private snakbar: MatSnackBar,
    private addCondition: MatDialog,
    private stateService: StateService,
    vocabulariesService: VocabulariesService
  ) {
    this.transformationConfigs = [];
    this.sourceTables = this.stateService.state.source.tables;
    this.vocabularies = vocabulariesService.vocabularies;
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
        this.transformationConfig.conditions[0].vocabularyConfig.conceptConfig
      );

      this.snakbar.open(
        `Configuration "${this.configurationNameControl.value}" has been created`,
        ' DISMISS ',
        { duration: 3000 }
      );

      this.configurationNameControl.reset();

      this.updateConfigurations();

      this.selectedConfiguration = [
        new DictionaryItem(this.transformationConfig.name)
      ];

      // Select default condition of the new configuration
      this.selectTransformationCondition(
        this.transformationConfig.conditions[0].name
      );
    },
    canExecute: () => this.configurationNameControl.valid
  });

  apply = new Command({
    execute: () => {
      const configCopy: TransformationConfig = cloneDeep(
        this.transformationConfig
      );

      this.transformationConfigs.push(configCopy);

      console.log(
        'Saved configuration',
        configCopy.conditions[0].vocabularyConfig.conceptConfig
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

  init() {
    // test
    if (this.sourceTables) {
      this.sourceFileds = this.sourceTables
        .slice(1, 2)
        .map(table => table.rows)
        .reduce((p, k) => p.concat.apply(p, k), [])
        .map(t => t.name);
    }

    if (this.sourceFileds) {
      this.sourceFiledsDictionary = this.sourceFileds.map(
        name => new DictionaryItem(name)
      );
    }

    if (this.vocabularies) {
      if (!this.transformationConfigFactory) {
        this.transformationConfigFactory = new TransformationConfigFactory(
          this.vocabularies
        );
        this.transformationConfig = this.transformationConfigFactory.createNew(
          'default',
          this.selectedSourceFields
        );
      }

      this.updateConfigurations();
      this.updateSelectedSourceFields();
      this.updateConditionsVariable();
      this.setLastAddedTransformatioNCondition();
      this.selectTransformationCondition(
        this.transformationConfig.conditions[0].name
      );

      setTimeout(() => {
        if (this.selectedSourceFields) {
          this.pselectedSourceFieldsDictionary = this.selectedSourceFields.map(
            sorceFieldName => new DictionaryItem(sorceFieldName)
          );
        }
      });
    }
  }

  onConfigurationSelected(vocabulary: IVocabulary) {
    if (!this.configurationNameControl.valid && !vocabulary) {
      return;
    } else if (vocabulary) {
      const index = this.transformationConfigs.findIndex(
        l => l.name === vocabulary.name
      );
      if (index > -1) {
        this.transformationConfig = this.transformationConfigs[index];

        this.selectTransformationCondition(
          this.transformationConfig.conditions[0].name
        );
      }
    }
  }

  onConditionSelected(event: any) {
    if (!event) {
      return;
    }

    const conditionName = event.name;
    const condition = this.transformationConfig.conditions.find(
      c => c.name === conditionName
    );

    if (condition) {
      this.updateConditionsVariable();

      this.selectTransformationCondition(conditionName);

      this.selectedCondition = [new DictionaryItem(conditionName)];
    }
  }

  onSourceFieldSelected(event: any) {}

  openConditionsDialog() {
    const data = {
      sourceFields: this.sourceFileds,
      config: this.transformationConfig,
      result: null
    };

    const dialogRef = this.addCondition.open(ConditionDialogComponent, {
      data
    });

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

      this.selectedCondition = [new DictionaryItem(name)];
    });
  }

  updateTransformationCondition(event: TransformationCondition) {
    const index = this.transformationConfig.conditions.findIndex(
      condition => condition.name === event.name
    );
    if (index > -1) {
      this.transformationConfig.conditions[index] = event;
      this.ptransformationCondition = this.transformationConfig.conditions[
        index
      ];
    }
  }

  private updateConfigurations() {
    const hash = new Set<string>();
    this.transformationConfigs.forEach(e => {
      hash.add(e.name);
    });

    this.pconfigurations = Array.from(hash.values()).map(
      e => new DictionaryItem(e)
    );
  }

  private updateConditionsVariable() {
    this.pconditions = this.transformationConfig.conditions.map(
      c => new DictionaryItem(c.name)
    );
  }

  private updateSelectedSourceFields() {
    this.pselectedSourceFieldsDictionary = this.transformationConfig.selectedSourceFields.map(
      c => new DictionaryItem(c)
    );
  }

  private setLastAddedTransformatioNCondition() {
    this.ptransformationCondition = this.transformationConfig.conditions[
      this.transformationConfig.conditions.length - 1
    ];
  }

  private selectTransformationCondition(name: string) {
    const index = this.transformationConfig.conditions.findIndex(
      condition => condition.name === name
    );
    if (index > -1) {
      this.ptransformationCondition = this.transformationConfig.conditions[
        index
      ];

      this.selectedCondition = [
        new DictionaryItem(this.ptransformationCondition.name)
      ];
    }
  }
}
