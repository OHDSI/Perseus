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
import { TypeConcept } from '../model/concept-type';

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

  typeConcept: TypeConcept[];

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.selectedSourceFields) {
      this.typeConcept = this.selectedSourceFields.map(fieldName => {
        const typeconcept: TypeConcept = {
          sourceFieldName: fieldName,
          visitTypeIP: 'IP',
          valueIP: '0',
          visitTypeOP: 'OP',
          valueOP: '0',
          visitTypeER: 'ER',
          valueER: '0'
        };

        const idx = this.vocabularyConfig.typeConcept.findIndex(tc => tc.sourceFieldName === fieldName);
        if (idx > -1) {
          return this.vocabularyConfig.typeConcept[idx];
        }

        return typeconcept;
      });

      this.vocabularyConfig.typeConcept = this.typeConcept;
    }
  }

  outConfigHandler(event: ConceptConfig) {
    this.configOut.emit(this.transformationCondition);
  }
}


