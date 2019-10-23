import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ConceptConfig } from '../model/config-concept';
import { TransformationCondition } from '../model/transformation-config';
import { VocabularyConfig } from '../model/vocabulary-config';

@Component({
  selector: 'app-vocabulary-config',
  templateUrl: './vocabulary-config.component.html',
  styleUrls: ['./vocabulary-config.component.scss']
})
export class VocabularyConfigComponent implements OnInit {
  @Input() transformationCondition: TransformationCondition;
  @Output() configOut = new EventEmitter<TransformationCondition>();

  get vocabularyConfig(): VocabularyConfig {
    return this.transformationCondition.vocabularyConfig;
  }
  constructor() { }

  ngOnInit() {
  }

  outConfigHandler(event: ConceptConfig) {
    this.configOut.emit(this.transformationCondition);
  }
}
