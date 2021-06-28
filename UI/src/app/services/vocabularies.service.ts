import { Injectable } from '@angular/core';

import domain from '../../assets/vocabularies/domainlist.json';
import lookup from '../../assets/vocabularies/lookuplist.json';
import concept from '../../assets/vocabularies/conceptlist.json';

@Injectable()
export class VocabulariesService {

  private readonly data: IVocabulary[];

  constructor() {
    this.data = [
      { name: 'domain', payload: domain.domain },
      { name: 'lookup', payload: lookup.lookup },
      { name: 'concept', payload: concept.concepts }
    ];
  }

  get vocabularies(): IVocabulary[] {
    return this.data;
  }
}

export interface IVocabulary {
  name: string;
  payload: string[];
}
