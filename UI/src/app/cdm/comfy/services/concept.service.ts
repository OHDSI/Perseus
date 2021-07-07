import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITable, ITableOptions, Table } from 'src/app/models/table';

import { Row, RowOptions } from 'src/app/models/row';
import { Area } from 'src/app/models/area';
import { IConnector } from 'src/app/models/connector.interface';

const CONCEPT_COLUMNS = [
  'CONCEPT_ID',
  'SOURCE_CONCEPT_ID',
  'TYPE_CONCEPT_ID',
  'SOURCE_VALUE'
];

const COMMON_COLUMNS = [
  'PERSON_ID',
  'START_DATE',
  'START_DATETIME',
  'END_DATE',
  'END_DATETIME',
  'PROVIDER_ID',
  'VISIT_OCCURRENCE_ID',
  'VISIT_DETAIL_ID'
];

export const isConceptTable = (tableName: string): boolean => {
  return environment.conceptTables.findIndex(name => tableName === name) > -1;
};

export const isConcept = (connector: IConnector): boolean => {
  return CONCEPT_COLUMNS.findIndex(name => connector.target.name.indexOf(name) > -1) > -1;
};

@Injectable()
export class ConceptService {
  getConceptTables(allTargetTables: ITable[]): ITable[] {
    let conceptTablesRaw = allTargetTables.filter(
      targetTable =>
        environment.conceptTables.findIndex(
          conceptTableName =>
            conceptTableName.toUpperCase() === targetTable.name.toUpperCase()
        ) > -1
    );

    conceptTablesRaw = conceptTablesRaw.map(table => {
      if (['CONCEPT', 'COMMON'].indexOf(table.name.toUpperCase()) < 0) {
        table.rows = table.rows.filter(row => {
          return (
            CONCEPT_COLUMNS.filter(
              concept => row.name.toUpperCase().indexOf(concept) > -1
            ).length === 0 &&
            COMMON_COLUMNS.filter(
              concept => row.name.toUpperCase().indexOf(concept) > -1
            ).length === 0
          );
        });
      }
      return table;
    });

    return conceptTablesRaw;
  }

  initSpecialtables(): ITable[] {
    const conceptTableId = -100;
    const commonTableId = -101;

    const conceptTableName = 'CONCEPT';
    const commonTableName = 'COMMON';

    const conceptRowOptions: RowOptions = {
      id: 1,
      tableId: conceptTableId,
      tableName: conceptTableName,
      name: 'CONCEPT',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions1: RowOptions = {
      id: 2,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'PERSON_ID',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions2: RowOptions = {
      id: 3,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'START_DATE',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions3: RowOptions = {
      id: 4,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'START_DATETIME',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions4: RowOptions = {
      id: 5,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'END_DATE',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions5: RowOptions = {
      id: 6,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'END_DATETIME',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions6: RowOptions = {
      id: 7,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'PROVIDER_ID',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions7: RowOptions = {
      id: 8,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'VISIT_OCCURRENCE_ID',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions8: RowOptions = {
      id: 9,
      tableId: commonTableId,
      tableName: commonTableName,
      name: 'VISIT_DETAIL_ID',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const conceptTableOptions: ITableOptions = {
      id: conceptTableId,
      area: Area.Target,
      name: 'CONCEPT',
      rows: [new Row(conceptRowOptions)],
      visible: true
    };

    const commonTableOptions: ITableOptions = {
      id: commonTableId,
      area: Area.Target,
      name: 'COMMON',
      rows: [
        new Row(commonRowOptions1),
        new Row(commonRowOptions2),
        new Row(commonRowOptions3),
        new Row(commonRowOptions4),
        new Row(commonRowOptions5),
        new Row(commonRowOptions6),
        new Row(commonRowOptions7),
        new Row(commonRowOptions8)
      ],
      visible: true
    };

    return [new Table(conceptTableOptions), new Table(commonTableOptions)];
  }
}
