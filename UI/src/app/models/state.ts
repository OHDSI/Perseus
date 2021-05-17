import { ITable } from './table';
import { IRow } from './row';
import { TableConcepts } from '../cdm/mapping/concept-transformation/model/concept';

export interface State {
  version?: string,
  filteredTables?: {
    items: ITable[]
    types: string,
    checkedTypes: string
  },
  filteredFields?: any[],
  target: ITable[],
  targetConfig: {
    [key: string]: {
      name: string, // Target table name
      first: string,
      data: string[] // Mapped source tables
    }
  },
  source: ITable[],
  mappedSource?: ITable[],
  report?: string // Full report name with extension,
  linkTablesSearch: {
    source?: string,
    target?: string,
    sourceColumns?: any
  },
  linkFieldsSearch?: {
    [key: string]: string
  },
  cdmVersions?: string[],
  targetClones?: {
    [key: string]: ITable[]
  },
  reportFile?: File,
  mappingEmpty?: boolean,
  sourceSimilar?: IRow[],
  targetSimilar?: IRow[],
  recalculateSimilar?: boolean,
  concepts?: {
    [key: string]: TableConcepts
  },
  isMappingPage?: boolean,
  filtered?: string
  selectedSourceTableId?: number // Selected source table ID on mapping page
  selectedTargetTableId?: number // Selected target table ID on mapping page
  sourceSimilarTableId?: number // Source similar table id
  targetSimilarTableId?: number // Target similar table id
}
