import { Column } from '../../../../models/grid/grid';

export const targetColumns: Column[] = [
  {
    field: 'conceptId',
    name: 'Concept ID'
  },
  {
    field: 'conceptName',
    name: 'Concept Name'
  },
  {
    field: 'domain',
    name: 'Domain'
  },
  {
    field: 'conceptClass',
    name: 'Concept Class'
  },
  {
    field: 'vocabulary',
    name: 'Vocabulary'
  },
  {
    field: 'conceptCode',
    name: 'Concept Code'
  },
  {
    field: 'standardCode',
    name: 'Standard Code'
  }
]

export const matchScoreColumn = () => ({
  field: 'matchScore', name: 'Match Score'
})
