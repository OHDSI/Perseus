import { IRow } from '@models/row';

/**
 * @return id - arrow id for arrowCache in bridge-service
 */
export function getConnectorId(source: IRow, target: IRow): string {
  const sourceRowId = source.id;
  const targetRowId = target.id;
  const sourceTableId = source.tableId;
  const targetTableId = target.tableId;

  return `${sourceTableId}-${sourceRowId}/${targetTableId}-${targetRowId}`;
}
