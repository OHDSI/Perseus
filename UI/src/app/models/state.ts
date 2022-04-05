import { ITable } from './table';
import { IRow } from './row';
import { IConcepts } from '@models/concepts';
import { IClones } from '@models/clones';
import { EtlMapping } from '@models/perseus/etl-mapping'

export interface State {
  etlMapping?: EtlMapping
  version?: string,
  filteredTables?: {
    items: ITable[]
    types: string,
    checkedTypes: string
  },
  filteredFields?: any[],
  target: ITable[],
  targetConfig: TargetConfig,
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
  targetClones?: IClones,
  reportFile?: File,
  mappingEmpty?: boolean,
  sourceSimilar?: IRow[],
  targetSimilar?: IRow[],
  recalculateSimilar?: boolean,
  concepts?: IConcepts,
  isMappingPage?: boolean,
  filtered?: string
  selectedSourceTableId?: number // Selected source table ID on mapping page
  selectedTargetTableId?: number // Selected target table ID on mapping page
  sourceSimilarTableId?: number // Source similar table id
  targetSimilarTableId?: number // Target similar table id
}

export interface TargetConfig {
  [key: string]: {
    name: string, // Target table name
    first: string,
    data: string[] // Mapped source tables
  }
}
