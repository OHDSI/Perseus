import { hasCapitalLetter, mapToPostgresSqlName } from '@shared/sql-editor/sql-editor'
import { Row } from '@models/row'

describe('SqlEditor', () => {
  it('should return true if string contains capital letter', () => {
    const srt1 = 'Qwerty'
    const str2 = 'QwertY'
    const str3 = 'qwerty'

    expect(hasCapitalLetter(srt1)).toBeTrue()
    expect(hasCapitalLetter(str2)).toBeTrue()
    expect(hasCapitalLetter(str3)).toBeFalse()
  })

  it('should parse sql column name to Postgre format', () => {
    const column1 = 'id'
    const column2 = 'Age'
    const column3 = 'GENDER'

    expect(mapToPostgresSqlName(createFakeRow(column1))).toBe('id')
    expect(mapToPostgresSqlName(createFakeRow(column2))).toBe('"Age"')
    expect(mapToPostgresSqlName(createFakeRow(column3))).toBe('"GENDER"')
  })
})

function createFakeRow(name) {
  return new Row({name})
}
