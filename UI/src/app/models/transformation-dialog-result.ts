import { Lookup } from '@models/perseus/lookup'
import { SqlForTransformation } from '@models/transformation/sql-for-transformation'

export interface TransformationDialogResult {
  lookup?: Lookup
  sql?: SqlForTransformation
}
