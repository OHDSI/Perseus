export interface Filter {
  name: string;
  field: string;
  color?: string;
  values?: FilterValue[];
  checkboxField?: string;
}

export interface FilterValue {
  name: string;
  count?: number;
  filterIndex?: number; // Parent index
  disabled: boolean;
}
