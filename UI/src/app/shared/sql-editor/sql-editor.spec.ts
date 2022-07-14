import { hasCapitalLetter, mapToPostgresSqlName, selectMatcher } from '@shared/sql-editor/sql-editor'
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

  it('should match select all', () => {
    const selectAll1 = 'select*'
    const selectAll2 = 'SELECT *'
    const selectAll3 = 'Select  *'
    const selectAll4 = 'SelecT\n*'
    const selectAll5 = 'seLect \n*'
    const selectAll6 = 'SELECT * FROM'
    const selectAll7 = 'SELEC *'

    expect(selectAll1).toMatch(selectMatcher)
    expect(selectAll2).toMatch(selectMatcher)
    expect(selectAll3).toMatch(selectMatcher)
    expect(selectAll4).toMatch(selectMatcher)
    expect(selectAll5).toMatch(selectMatcher)
    expect(selectAll6).toMatch(selectMatcher)
    expect(selectAll7.match(selectMatcher)).toBeNull()
  })
})

function createFakeRow(name) {
  return new Row({name})
}
