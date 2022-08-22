import { ITable } from './table';
import { IRow } from './row';
import { IConcepts } from '@models/perseus/concepts';
import { IClones } from '@models/clones';
import { EtlMapping } from '@models/perseus/etl-mapping'
import { TargetConfig } from '@models/target-config'
import { FilteredFields } from '@models/filtered-fields'

export interface State {
  etlMapping?: EtlMapping
  filteredTables?: {
    items: ITable[]
    types: string,
    checkedTypes: string
  },
  filteredFields?: FilteredFields,
  target: ITable[],
  targetConfig: TargetConfig,
  source: ITable[],
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
  sourceSimilar?: IRow[],
  targetSimilar?: IRow[],
  recalculateSimilar?: boolean,
  concepts?: IConcepts,
  selectedSourceTableId?: number // Selected source table ID on mapping page
  selectedTargetTableId?: number // Selected target table ID on mapping page
  sourceSimilarTableId?: number // Source similar table id
  targetSimilarTableId?: number // Target similar table id
}

