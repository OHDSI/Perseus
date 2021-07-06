import { SwitchCaseTransformationFunction } from '@mapping/sql-transformation/visual-transformation/function/switch-case-transformation-function/switch-case-transformation-function';

describe('SwitchCaseTransformationFunction', () => {

  it('should get sql for switch case function with string arguments and default block', () => {
    const transformationFunction = new SwitchCaseTransformationFunction({
      cases: [
        {
          id: 1,
          in: 'input',
          out: 'output'
        },
        {
          id: 2,
          out: 'default',
          isDefault: true
        }
      ]
    }, 'string')

    const actual = transformationFunction.sql()('value')
    expect(actual).toBe(
      `CASE(value)\n\tWHEN 'input' THEN 'output'\n\tELSE 'default'\nEND`
    )
  })

  it('should get sql for switch case function with number arguments', () => {
    const transformationFunction = new SwitchCaseTransformationFunction({
      cases: [
        {
          id: 1,
          in: 1,
          out: 2
        },
        {
          id: 2,
          in: 2,
          out: 3
        }
      ]
    }, 'integer')

    const actual = transformationFunction.sql()('id')
    expect(actual).toBe(
      `CASE(id)\n\tWHEN 1 THEN 2\n\tWHEN 2 THEN 3\nEND`
    )
  })

  it('should get sql for switch case function with date arguments', () => {
    const transformationFunction = new SwitchCaseTransformationFunction({
      cases: [
        {
          id: 1,
          in: '2021-06-06',
          out: '2021-06-07'
        }
      ]
    }, 'date')

    const actual = transformationFunction.sql()('id')
    expect(actual).toBe(
      `CASE(id)\n\tWHEN 2021-06-06 THEN 2021-06-07\nEND`
    )
  })
})
