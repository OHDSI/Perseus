import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';
import { VocabularyConfiguration } from './vocabulary-configuration/vocabulary-configuration.component';

@Component({
  selector: 'app-vocabulary-transform-configurator',
  templateUrl: './vocabulary-transform-configurator.component.html',
  styleUrls: ['./vocabulary-transform-configurator.component.scss']
})
export class VocabularyTransformConfiguratorComponent
  implements OnInit, OnChanges {
  @Input() vocabularies: IVocabulary[];

  domainVocabulary: IVocabulary;
  lookupVocabulary: IVocabulary;
  conceptVocabulary: IVocabulary;

  private dictionaries = [
    'source_vocabulary',
    'target_vocabulary',
    'source_concept_class',
    'target_concept_class',
    'target_domain'
  ];
  // private model = new Map<string, VocabularyConfiguration>();
  private model = new Map<string, VocabularyConfiguration>();

  constructor() {
    this.dictionaries.forEach(key => {
      this.model.set(key, {});
    });
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.vocabularies) {
      this.domainVocabulary = this.findVocabulary('domain');
      this.lookupVocabulary = this.findVocabulary('lookup');
      this.conceptVocabulary = this.findVocabulary('concept');
    }
  }

  findVocabulary(name: string): IVocabulary {
    const idx = this.vocabularies.findIndex(v => v.name === name);
    if (idx > -1) {
      return this.vocabularies[idx];
    } else {
      return null;
    }
  }

  sourceVocabulary(event: VocabularyConfiguration) {
    const key = 'source_vocabulary';
    this.updateModel(key, event);
  }
  targetVocabulary(event: VocabularyConfiguration) {
    const key = 'target_vocabulary';
    this.updateModel(key, event);
  }
  sourceConcept(event: VocabularyConfiguration) {
    const key = 'source_concept_class';
    this.updateModel(key, event);
  }
  targetConcept(event: VocabularyConfiguration) {
    const key = 'target_concept_class';
    this.updateModel(key, event);
  }
  targetDomain(event: VocabularyConfiguration) {
    const key = 'target_domain';
    this.updateModel(key, event);
  }

  onSavePressed() {
    // const modelFlat = Object.values(this.model);
    const config = {};
    const lookupConfiguration = this.model.forEach((value, key) => {
      config[key] = [
        value.in ? { in: value.in.map(item => item.name) } : { in: [] },
        value.notin ? { in: value.notin.map(item => item.name) } : { notin: [] },
      ];
    });
    console.log(config);
  }

  private updateModel(key: string, value: VocabularyConfiguration) {
    if (this.model.has(key)) {
      this.model.delete(key);
    }

    this.model.set(key, value);
  }
}

/*
    {
  "source_vocabulary": [
    {"in": ["s_voc1", "s_voc2"]},
    {"not_in": ["s_voc3", "s_voc4"]}
  ],
  "target_vocabulary": [
    {"in": ["t_voc1", "t_voc2"]},
    {"not_in": ["t_voc3", "t_voc4"]}
  ],
  "source_concept_class": [
    {"in": ["s_concept1", "s_concept2"]},
    {"not_in": ["s_concept3", "s_concept4"]}
  ],
  "target_concept_class": [
    {"in": ["t_concept1", "t_concept2"]},
    {"not_in": ["t_concept3", "t_concept4"]}
  ],
  "target_domain": [
    {"in": ["t_domain1", "t_domain2"]},
    {"not_in": ["t_domain3", "t_domain4"]}
  ]
}
    */
