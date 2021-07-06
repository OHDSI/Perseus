import { ReplaceTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/replace-transformation-function/replace-transformation-function';

describe('ReplaceTransformationFunction', () => {

  it('should get sql for replace function', () => {
    const transformationFunction = new ReplaceTransformationFunction({
      old: 'old',
      new: 'new'
    }, 'string')

    const actual = transformationFunction.sql()('value')
    expect(actual).toBe(`REPLACE(value, 'old', 'new')`)
  })

  it('should get sql for replace function with number arguments', () => {
    const transformationFunction = new ReplaceTransformationFunction({
      old: 1,
      new: 2
    }, 'integer')

    const actual = transformationFunction.sql()('value')
    expect(actual).toBe(`REPLACE(value, 1, 2)`)
  })
})

