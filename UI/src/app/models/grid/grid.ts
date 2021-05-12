export interface Column {
  field: string;
  name: string;
  width?: string;
  className?: string;
}

export interface Sort {
  field: string;
  order: string;
}

export const columnToField = (column: Column) => column.field
