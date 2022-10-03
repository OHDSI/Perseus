import { FilterValue } from '@models/filter/filter'

export const findFilterValue = (curr: FilterValue) => (value: FilterValue) =>
  value.filterIndex === curr.filterIndex && value.name === curr.name


export const filterValues = (exclude: FilterValue) => (value: FilterValue) =>
  value.filterIndex !== exclude.filterIndex && value.name !== exclude.name
