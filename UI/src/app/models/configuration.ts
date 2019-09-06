import { ArrowCache } from './arrow-cache';

export interface ConfigurationOptions {
  name?: string;
  tablesConfiguration?: any;
  mappingsConfiguration?: ArrowCache;
}

export class Configuration {
  get arrows(): any {
    return JSON.parse(this.mappingsConfiguration);
  }

  get tables(): any {
    return JSON.parse(this.tablesConfiguration);
  }

  name: string;
  mappingsConfiguration: string;
  tablesConfiguration: string;

  constructor(options: ConfigurationOptions = {}) {
    this.name = options.name;
    this.mappingsConfiguration = JSON.stringify(options.mappingsConfiguration);
    this.tablesConfiguration = JSON.stringify(options.tablesConfiguration);
  }
}
