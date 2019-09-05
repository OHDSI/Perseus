import { Injectable } from '@angular/core';
import { Configuration } from '../models/configuration';

@Injectable()
export class SavedMappingService {

  mappingConfigurations = [];

  save(mapping: Configuration) {
    this.mappingConfigurations.push(mapping);
  }

  open(name: string): Configuration {
    const idx = this.mappingConfigurations.findIndex(config => config.name === name);
    if (idx > -1) {
      return this.mappingConfigurations[idx];
    } else {
      return null;
    }
  }
}

