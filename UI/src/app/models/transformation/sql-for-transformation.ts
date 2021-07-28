import { SqlFunctionForTransformationState } from '@models/transformation/sql-function-for-transformation';
import { SqlTransformMode } from '@models/transformation/sql-transform-mode';

export interface SqlForTransformation {
  applied?: boolean
  name?: string // For Manual sql
  functions?: SqlFunctionForTransformationState[] // For Visual sql
  mode?: SqlTransformMode
}
