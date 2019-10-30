import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { ConceptConfig } from '../model/config-concept';
import { TransformationCondition } from '../model/transformation-config';
import { VocabularyConfig } from '../model/vocabulary-config';

@Component({
  selector: 'app-vocabulary-config',
  templateUrl: './vocabulary-config.component.html',
  styleUrls: ['./vocabulary-config.component.scss']
})
export class VocabularyConfigComponent implements OnInit, OnChanges {
  @Input() transformationCondition: TransformationCondition;
  @Input() selectedSourceFields: string[] = [];
  @Output() configOut = new EventEmitter<TransformationCondition>();

  get vocabularyConfig(): VocabularyConfig {
    return this.transformationCondition.vocabularyConfig;
  }

  typeConceptItems: TypeConcept[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.selectedSourceFields) {
      this.typeConceptItems = this.selectedSourceFields.map(fieldName => {
        const typeconcept: TypeConcept = {
          sourceFieldName: fieldName,
          visitTypeIP: 'IP',
          valueIP: '0',
          visitTypeOP: 'OP',
          valueOP: '0',
          visitTypeER: 'ER',
          valueER: '0'
        };

        return typeconcept;
      });
    }
  }

  outConfigHandler(event: ConceptConfig) {
    this.configOut.emit(this.transformationCondition);
  }
}

export interface TypeConcept {
  sourceFieldName: string;
  visitTypeIP: 'IP';
  valueIP: string;
  visitTypeOP: 'OP';
  valueOP: string;
  visitTypeER: 'ER';
  valueER: string;
}

export type VisitType = 'IP|OP|ER';
