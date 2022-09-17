import {
  hasCapitalLetter,
  mapRowToPostgresSqlName,
  SELECT_MATCHER,
  TABLE_ALIAS_MATCHER
} from '@shared/sql-editor/sql-editor'
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

    expect(mapRowToPostgresSqlName(createFakeRow(column1))).toBe('id')
    expect(mapRowToPostgresSqlName(createFakeRow(column2))).toBe('"Age"')
    expect(mapRowToPostgresSqlName(createFakeRow(column3))).toBe('"GENDER"')
  })

  it('should match select all', () => {
    const selectAll1 = 'select*'
    const selectAll2 = 'SELECT *'
    const selectAll3 = 'Select  *'
    const selectAll4 = 'SelecT\n*'
    const selectAll5 = 'seLect \n*'
    const selectAll6 = 'SELECT * FROM'
    const selectAll7 = 'SELEC *'

    expect(selectAll1).toMatch(SELECT_MATCHER)
    expect(selectAll2).toMatch(SELECT_MATCHER)
    expect(selectAll3).toMatch(SELECT_MATCHER)
    expect(selectAll4).toMatch(SELECT_MATCHER)
    expect(selectAll5).toMatch(SELECT_MATCHER)
    expect(selectAll6).toMatch(SELECT_MATCHER)
    expect(selectAll7.match(SELECT_MATCHER)).toBeNull()
  })

  it('should match table alias', () => {
    const query1 = 'select * from lower as t1\n' +
      '      join test_data as t2 on t1.id = t2.id'
    const query2 = 'select * from lower as t1\n' +
      '      join upper as t2 on t1.id = t2."ID"\n' +
      '      join "UPPER2" as t3 on t1.id = t2."ID"'
    const query3 = 'select * from\n' +
      'lower as t1\n' +
      'join test_data\n' +
      'as t2 on t1.id = t2.id'
    const query4 = 'select * from   lower as t1\n' +
      '      join   test_data as t2 on'

    expect(Array.from(query1.match(TABLE_ALIAS_MATCHER.REGEX))?.length).toBe(2)
    expect(Array.from(query2.match(TABLE_ALIAS_MATCHER.REGEX))?.length).toBe(3)
    expect(Array.from(query3.match(TABLE_ALIAS_MATCHER.REGEX))?.length).toBe(2)
    expect(Array.from(query4.match(TABLE_ALIAS_MATCHER.REGEX))?.length).toBe(2)
  })
})

function createFakeRow(name) {
  return new Row({name})
}
