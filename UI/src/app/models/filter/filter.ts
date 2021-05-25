export interface Filter {
  name: string;
  field: string;
  color?: string;
  values: FilterValue[];
}

export interface FilterValue {
  name: string;
  count: number;
  filterIndex: number;
  checked: boolean;
  disabled: boolean;
}
