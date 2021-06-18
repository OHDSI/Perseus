import { IRow } from '@models/row';

/**
 * @return id - constant id for constantCache in bridge-service
 */
export function getConstantId(sourceTableId: number, target: IRow): string {
  const targetRowId = target.id;
  const targetTableId = target.tableId;

  return `${sourceTableId}/${targetTableId}-${targetRowId}`;
}
