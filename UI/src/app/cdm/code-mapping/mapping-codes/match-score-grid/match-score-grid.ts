export const defaultRowHeight = 34

export interface MatchScoreSort {
  enabled: boolean
  order?: 'asc' | 'desc'
}

/**
 * get index by row data attribute
 */
export function getRowIndexByDataAttribute(row: HTMLElement): number {
  return parseInt(row?.dataset['row'], 10)
}

/**
 * @param firstRow - source or match-score or first target row
 * @param lastRow - last target row
 * @param gridTop - grid top position
 * @param gridHeight - selection top position relative grid
 * @return result - result.top - selection top position relative grid, result.height - selection height
 */
export function getSelectionTopAndHeight(firstRow: HTMLElement,
                                         lastRow: HTMLElement,
                                         gridTop: number,
                                         gridHeight: number): {top: number; height} {
  // Calculate selection top
  const rect1 = firstRow.getBoundingClientRect()
  const top = Math.max(rect1.top - gridTop, 0) // Not less than top position

  // Calculate selection height
  const rect2 = lastRow.getBoundingClientRect()
  const lastTargetRowBottom = rect2.bottom - gridTop
  const height = Math.min(lastTargetRowBottom - top, gridHeight - top) // Not more than grid height

  return {top, height}
}

export function sourceColumnKeyToName(key: string): string {
  switch (key) {
    case 'sourceCode':
      return 'Source Code'
    case 'sourceName':
      return 'Source Name'
    case 'sourceFrequency':
      return 'Source Frequency'
    case 'columnType':
      return 'Column Type'
    case 'autoConceptId':
      return 'Auto concept ID'
    case 'additionalInfo':
      return 'Additional Info'
    default:
      throw Error('Unexpected column type')
  }
}
