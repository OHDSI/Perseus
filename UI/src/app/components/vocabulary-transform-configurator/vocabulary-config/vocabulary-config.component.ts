import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VocabularyConfig } from '../model/vocabulary-config';
import { ConceptConfig } from '../model/config-concept';

@Component({
  selector: 'app-vocabulary-config',
  templateUrl: './vocabulary-config.component.html',
  styleUrls: ['./vocabulary-config.component.scss']
})
export class VocabularyConfigComponent implements OnInit {
  @Input() vocabularyConfig: VocabularyConfig;

  constructor() { }

  ngOnInit() {
  }

  outConfigHandler(event: ConceptConfig) {
    console.log(event);
  }
}
