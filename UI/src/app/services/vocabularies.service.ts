import { Injectable } from '@angular/core';

import * as domain from '../../assets/vocabularies/domainlist.json';
import * as lookup from '../../assets/vocabularies/lookuplist.json';
import * as concept from '../../assets/vocabularies/conceptlist.json';

@Injectable({
  providedIn: 'root'
})
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
