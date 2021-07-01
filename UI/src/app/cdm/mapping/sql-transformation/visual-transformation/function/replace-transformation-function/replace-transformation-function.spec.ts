import { ReplaceTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';

describe('ReplaceTransformationFunction', () => {

  it('should get sql for replace function', () => {
    const transformationFunction = new ReplaceTransformationFunction({
      old: 'old',
      new: 'new'
    })

    const actual = transformationFunction.sql()('value')
    expect(actual).toBe(`REPLACE(value, 'old', 'new')`)
  })
})

