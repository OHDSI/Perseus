import { IConnector } from '@models/connector';
import { IArrowCache } from '@models/arrow-cache';
import { Lookup } from '@models/perseus/lookup'
import { SqlForTransformation } from '@models/transformation/sql-for-transformation'
import { LookupType } from '@models/perseus/lookup-type'

export interface TransformationDialogData {
  connector: IConnector
  arrowCache: IArrowCache
  lookup: Lookup
  lookupType: LookupType,
  sql: SqlForTransformation,
  tab: string
}
