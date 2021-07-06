import { DatePartTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/date-part-transformation-function/date-part-transformation-function';

describe('DatePartTransformationFunction', () => {

  it('should get sql for date part function', () => {
    const transformationFunction = new DatePartTransformationFunction({
      part: 'Second'
    })

    const actual = transformationFunction.sql()('eventdate')
    expect(actual).toBe(`date_part('Second', eventdate)`)
  })
})
