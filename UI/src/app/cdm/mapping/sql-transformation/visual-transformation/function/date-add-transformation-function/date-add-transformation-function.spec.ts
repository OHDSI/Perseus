import { DateAddTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/date-add-transformation-function/date-add-transformation-function';

describe('DateAddTransformationFunction', () => {

  it('should get sql for data add function', () => {
    const transformationFunction = new DateAddTransformationFunction({
      datePart: 'Year',
      number: 1
    })

    const actual = transformationFunction.sql()('eventdate')
    expect(actual).toBe(`eventdate + (1 * interval '1 Year')`)
  })
})

