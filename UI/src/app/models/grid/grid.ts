export interface Column {
  field: string;
  name: string;
  width?: string;
  className?: string;
  sortable?: boolean
}

export interface Sort {
  field: string;
  order: 'asc' | 'desc';
}

export const columnToField = (column: Column) => column.field
