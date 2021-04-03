import { ArrowCache } from './arrow-cache';
import { Row } from './row';
import { IConnection } from '../services/bridge.service';
import { SqlFunction } from '../components/popups/rules-popup/transformation-input/model/sql-string-functions';
import { parse, stringify } from 'flatted';
import { Table } from './table';

export interface ConfigurationOptions {
  name?: string;
  tablesConfiguration?: any;
  mappingsConfiguration?: ArrowCache;
  source?: Table[];
  target?: Table[];
  report?: any;
  version?: any;
  filtered?: any;
  constants?: any;
  targetClones?: any;
  sourceSimilar?: Row[];
  targetSimilar?: Row[];
  recalculateSimilar?: boolean;
  concepts?: any;
}

export class Configuration {
  get arrows(): any {
    const rows = parse(this.mappingsConfiguration);
    Object.values(rows).forEach((row: IConnection) => {
      const { source, target, transforms } = row;
      row.source = Object.setPrototypeOf(source, Row.prototype);
      row.target = Object.setPrototypeOf(target, Row.prototype);
      row.transforms = transforms.map(t => new SqlFunction(t));
      if (!row.target.tableName.startsWith('cdm~')) {
        const prefixedTableName = `cdm~${row.target.tableName}`;
        row.target.tableName = prefixedTableName;
        row.connector.target.tableName = prefixedTableName;
      }
    });
    return rows;
  }

  get tables(): any {
    const tablesConfig = JSON.parse(this.tablesConfiguration);
    if(!Object.keys(tablesConfig)[0].startsWith('cdm~')){
      const newTablesConfig = {};
      Object.keys(tablesConfig).forEach(key => {
          const prefixedTableName = `cdm~${key}`;
          tablesConfig[ key ].data[ 0 ] = prefixedTableName;
          tablesConfig[ key ].first = prefixedTableName;
          tablesConfig[ key ].name = tablesConfig[ key ].name.replace('target', 'target-cdm~');
          newTablesConfig[prefixedTableName] = tablesConfig[ key ];
      })
      return newTablesConfig
    }
    return tablesConfig;
  }

  get sourceTables(): Table[] {
    const tables = [];
    parse(this.source).map(item => tables.push(new Table(item)));
    return tables;
  }

  get targetTables(): Table[] {
    const tables = [];
    parse(this.target).map(item => tables.push(new Table(item)));
    if (!tables[0].name.startsWith('cdm~')) {
      tables.forEach(it => it.name = `cdm~${it.name}`);
    }
    return tables;
  }

  get reportName(): any {
    return JSON.parse(this.report);
  }

  get cdmVersion(): any {
    return JSON.parse(this.version);
  }

  get isFiltered(): any {
    return JSON.parse(this.filtered);
  }

  get constantsCache(): any {
    if (this.constants) {
      let constants;
      try {
        constants = parse(this.constants);
      } catch {
        constants = JSON.parse(this.constants)
      }
      if (Object.keys(constants).length && !(Object.values(constants)[0] as any).tableName.startsWith('cdm~')) {
        (Object.values(constants) as any).forEach(item => item.tableName = `cdm~${item.tableName}`)
      }
      return constants;
    }
    return {};
  }

  get targetClones(): any {
    const clonesResult = {};
    const clones = parse(this.targetTablesClones);
    Object.keys(clones).forEach(item => {
      const cloneTables = [];
       const cloneList = clones[item];
       cloneList.forEach(it => cloneTables.push(new Table(it)));
       clonesResult[item] = cloneTables;
    });
    if(Object.keys(clonesResult).length && !Object.keys(clonesResult)[0].startsWith('cdm~')){
      const prefixedClones = {};
      Object.keys(clonesResult).forEach(key => {
        clonesResult[key].forEach(it => it.name = `cdm~${it.name}`);
        prefixedClones[`cdm~${key}`] = clonesResult[key];
      })
      return prefixedClones;
    }
    return clonesResult;
  }

  get targetSimilarRows(): any {
    if (parse(this.targetSimilar)) {
      const rows = [];
      parse(this.targetSimilar).map(item => rows.push(new Row(item)));
      return rows;
    }
  }

  get sourceSimilarRows(): any {
    if (parse(this.sourceSimilar)) {
      const rows = [];
      parse(this.sourceSimilar).map(item => rows.push(new Row(item)));
      return rows;
    }
  }

  get recalculateSimilarTables(): any {
    if (this.recalculateSimilar) {
      return JSON.parse(this.recalculateSimilar)
    }
    return true;
  }

  get tableConcepts(): any {
    if (this.concepts) {
      const parsedConcepts =  JSON.parse(this.concepts);
      if(Object.keys(parsedConcepts).length && !Object.keys(parsedConcepts)[0].startsWith('cdm~')){
        const prefixedConcepts = {}
        Object.keys(parsedConcepts).forEach(key => prefixedConcepts[`cdm~${key}`] = parsedConcepts[key]);
        return prefixedConcepts
      }
      return parsedConcepts;
    }
    return {};
  }



  name: string;
  mappingsConfiguration: string;
  tablesConfiguration: string;
  source: string;
  target: string;
  report: string;
  version: string;
  filtered: string;
  constants: string;
  targetTablesClones: string;
  sourceSimilar: string;
  targetSimilar: string;
  recalculateSimilar: string;
  concepts: string;

  constructor(options: ConfigurationOptions = {}) {
    this.name = options.name;
    this.mappingsConfiguration = stringify(options.mappingsConfiguration);
    this.tablesConfiguration = JSON.stringify(options.tablesConfiguration);
    this.source = stringify(options.source);
    this.target = stringify(options.target);
    this.report = JSON.stringify(options.report);
    this.version = JSON.stringify(options.version);
    this.filtered = JSON.stringify(options.filtered);
    this.constants = stringify(options.constants);
    this.targetTablesClones = stringify(options.targetClones);
    this.sourceSimilar = stringify(options.sourceSimilar);
    this.targetSimilar = stringify(options.targetSimilar);
    this.recalculateSimilar = JSON.stringify(options.recalculateSimilar);
    this.concepts = JSON.stringify(options.concepts);
  }
}
