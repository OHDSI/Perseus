import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITable, Table } from 'src/app/models/table';

import { Row, RowOptions } from 'src/app/models/row';
import { Area } from 'src/app/models/area';

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
  'VIDIT_DETAIL_ID'
];

@Injectable()
export class ConceptService {
  isConceptTable(tableName: string): boolean {
    return environment.conceptTables.findIndex(name => tableName === name) > -1;
  }

  getConceptTables(allTargetTables: ITable[]): ITable[] {
    let conceptTablesRaw = allTargetTables.filter(
      targetTable =>
        environment.conceptTables.findIndex(
          conceptTableName => conceptTableName === targetTable.name
        ) > -1
    );

    conceptTablesRaw = conceptTablesRaw.map(table => {
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
      return table;
    });

    const conceptRows = [];
    for (let i = 0; i < CONCEPT_COLUMNS.length; i++) {
      const rowOptions: RowOptions = {
        id: i,
        tableId: -1,
        tableName: 'concept',
        name: CONCEPT_COLUMNS[i],
        type: 'any',
        comments: [],
        area: Area.Target
      };

      conceptRows.push(new Row(rowOptions));
    }

    const commonRows = [];
    for (let i = 0; i < COMMON_COLUMNS.length; i++) {
      const rowOptions: RowOptions = {
        id: i,
        tableId: -1,
        tableName: 'common',
        name: COMMON_COLUMNS[i],
        type: 'any',
        comments: [],
        area: Area.Target
      };

      commonRows.push(new Row(rowOptions));
    }

    const conceptTable = new Table(
      'concept',
      'target',
      'concept',
      conceptRows,
      true,
      true
    );

    const commonTable = new Table(
      'common',
      'target',
      'common',
      commonRows,
      true,
      true
    );

    const res = [];
    res.push(conceptTable);
    res.push(commonTable);

    return res.concat.apply(res, conceptTablesRaw);
  }
}
