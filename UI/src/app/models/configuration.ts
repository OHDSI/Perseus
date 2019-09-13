import { ArrowCache } from './arrow-cache';
import { Row } from './row';

export interface ConfigurationOptions {
  name?: string;
  tablesConfiguration?: any;
  mappingsConfiguration?: ArrowCache;
}

export class Configuration {
  get arrows(): any {
    const rows =  JSON.parse(this.mappingsConfiguration);
    Object.values(rows).forEach((row: any) => {
      const {source, target} = row;
      row.source = Object.setPrototypeOf(source, Row.prototype);
      row.target = Object.setPrototypeOf(target, Row.prototype);
      return row;
    });
    return rows;
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
