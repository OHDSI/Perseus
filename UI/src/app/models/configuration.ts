import { ArrowCache } from './arrow-cache';
import { Row } from './row';
import { IConnection } from '../services/bridge.service';
import { SqlFunction } from '../components/popups/rules-popup/transformation-input/model/sql-string-functions';

export interface ConfigurationOptions {
  name?: string;
  tablesConfiguration?: any;
  mappingsConfiguration?: ArrowCache;
}

export class Configuration {
  get arrows(): any {
    const rows = JSON.parse(this.mappingsConfiguration);
    Object.values(rows).forEach((row: IConnection) => {
      const { source, target, transforms } = row;
      row.source = Object.setPrototypeOf(source, Row.prototype);
      row.target = Object.setPrototypeOf(target, Row.prototype);
      row.transforms = transforms.map(t => new SqlFunction(t));
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
