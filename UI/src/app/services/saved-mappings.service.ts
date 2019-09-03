import { Injectable } from '@angular/core';
import { SavedMapping } from '../models/saved-mapping';

@Injectable()
export class SavedMappingService {

  mappingConfigurations = [];

  save(mapping: SavedMapping) {
    this.mappingConfigurations.push(mapping);
  }

  open(name: string): SavedMapping {
    const idx = this.mappingConfigurations.findIndex(config => config.name === name);
    if (idx > -1) {
      return this.mappingConfigurations[idx];
    } else {
      return null;
    }
  }
}

