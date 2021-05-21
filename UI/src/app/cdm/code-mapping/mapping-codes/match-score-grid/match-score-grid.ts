import { CodeMapping } from '../../../../models/code-mapping/code-mapping';

export const defaultRowHeight = 34

export function getRowIndexByDataAttribute(row: HTMLElement): number {
  return parseInt(row?.dataset['row'], 10)
}

export function getSelectionHeight(mapping: CodeMapping) {
  return (defaultRowHeight + 2) * mapping.targetConcepts.length  // 2 - border
}

export function getSelectionTop(row: HTMLElement, gridTop: number): number {
  return row.getBoundingClientRect().top - gridTop
}
