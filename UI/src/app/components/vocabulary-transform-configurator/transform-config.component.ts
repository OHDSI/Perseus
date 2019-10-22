import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { FormControl } from '@angular/forms';
import { VocabularyConfig } from './model/vocabulary-config';
import { DictionaryItem } from '../vocabulary-search-select/model/vocabulary';
import { MatSnackBar, MatDialog } from '@angular/material';
import { cloneDeep } from 'src/app/infrastructure/utility';
import {
  TransformationConfig,
  TransformationCondition
} from './model/transformation-config';
import { Command } from 'src/app/infrastructure/command';
import { ConditionDialogComponent } from './condition-dialog/condition-dialog.component';
import { ITable } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { VocabularyConditionResult } from './vocabulary-condition/vocabulary-condition.component';

@Component({
  selector: 'app-transform-config',
  templateUrl: './transform-config.component.html',
  styleUrls: ['./transform-config.component.scss']
})
export class TransformConfigComponent implements OnInit, OnChanges {
  @Input() sourceFileds: string[];
  @Input() vocabularies: IVocabulary[];
  @Input() selectedSourceFilelds: string[] = [];
  @Input() transformationConfigs: TransformationConfig[];

  @Input() sourceTables: ITable[]; // test

  get configurations(): DictionaryItem[] {
    return this.pconfigurations;
  }

  get vocabularyConfig(): VocabularyConfig {
    // Stub
    return this.transformationConfig.conditions[0].vocabularyConfig;
  }

  get conditions(): DictionaryItem[] {
    return this.pconditions;
  }

  private pconditions: DictionaryItem[];

  get selectedSourceFileds(): DictionaryItem[] {
    return this.pselectedSourceFileds;
  }

  private pselectedSourceFileds: DictionaryItem[];

  lookupnameControl = new FormControl();

  private configs: TransformationConfig[] = [];
  private pconfigurations: DictionaryItem[];
  private transformationConfig: TransformationConfig;

  constructor(private snakbar: MatSnackBar, private addCondition: MatDialog) {
    this.transformationConfigs = [];
  }

  save = new Command({
    execute: () => {
      const configCopy: TransformationConfig = cloneDeep(
        this.transformationConfig
      );

      this.configs.push(configCopy);
      this.transformationConfigs.push(configCopy);

      this.updateConfigurations();

      this.snakbar.open(
        `Lookup "${this.lookupnameControl.value}" has been added`,
        ' DISMISS ',
        { duration: 3000 }
      );

      this.lookupnameControl.reset();
    },
    canExecute: () => {
      return this.lookupnameControl.valid;
    }
  });

  delete = new Command({
    execute: () => {},
    canExecute: () => true
  });

  close = new Command({
    execute: () => {},
    canExecute: () => true
  });

  ngOnInit() {}

  ngOnChanges() {
    if (this.sourceTables) {
      this.sourceFileds = this.sourceTables
        .slice(1, 2)
        .map(table => table.rows)
        .reduce((p, k) => p.concat.apply(p, k), [])
        .map(t => t.name);
    }

    if (this.vocabularies) {
      const defaultTransformationCondition: TransformationCondition = {
        name: 'default',
        vocabularyConfig: new VocabularyConfig(this.vocabularies)
      };

      this.transformationConfig = {
        name: 'default',
        selectedSourceFields: this.selectedSourceFilelds,
        conditions: [defaultTransformationCondition]
      };

      this.updateConfigurations();
      this.updateSelectedSourceFields();
      this.updateConditions();
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

  private updateConditions() {
    this.pconditions = this.transformationConfig.conditions.map(
      c => new DictionaryItem(c.name)
    );
  }

  private updateSelectedSourceFields() {
    this.pselectedSourceFileds = this.transformationConfig.selectedSourceFields.map(
      c => new DictionaryItem(c)
    );
  }

  onLookupSelected(vocabulary: IVocabulary) {
    // TODO Error Save and Load configuration
    if (!this.lookupnameControl.valid && !vocabulary) {
      return;
    } else if (vocabulary) {
      this.lookupnameControl.setValue(vocabulary.name);
      const index = this.transformationConfigs.findIndex(
        l => l.name === vocabulary.name
      );
      if (index > -1) {
        this.transformationConfig = cloneDeep(
          this.transformationConfigs[index]
        );
      }
    }
  }

  onConditionSelected(event: any) {}

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

      this.updateConditions();
    });
  }
}
