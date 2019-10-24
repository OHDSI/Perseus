import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITable, Table, ITableOptions } from 'src/app/models/table';

import { Row, RowOptions } from 'src/app/models/row';
import { Area } from 'src/app/models/area';
import { IConnector } from 'src/app/models/interface/connector.interface';

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
          conceptTableName => conceptTableName.toUpperCase() === targetTable.name.toUpperCase()
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

    return conceptTablesRaw;
  }

  initSpecialtable() {
    const conceptRowOptions: RowOptions = {
      id: 1,
      tableId: -100,
      tableName: 'SPECIAL',
      name: 'CONCEPT',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const commonRowOptions: RowOptions = {
      id: 2,
      tableId: -100,
      tableName: 'SPECIAL',
      name: 'COMMON',
      type: 'any',
      comments: [],
      area: Area.Target
    };

    const tableOptions: ITableOptions = {
      id: -100,
      area: Area.Target,
      name: 'SPECIAL',
      rows: [new Row(conceptRowOptions), new Row(commonRowOptions)],
      visible: true,
      expanded: true
    };

    return new Table(tableOptions);
  }

  isSpecial(connector: IConnector): boolean {
    return connector.target.tableName.toUpperCase() === 'SPECIAL';
  }
}
