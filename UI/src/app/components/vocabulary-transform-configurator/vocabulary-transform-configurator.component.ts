import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IVocabulary } from 'src/app/services/vocabularies.service';

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

  constructor() {}

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
}
