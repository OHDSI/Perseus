import * as testMapping from '@test/test-mapping.json'
import { plainToConfiguration } from '@utils/etl-configuration-util';

describe('Concept Util', () => {
  it('should map plain objects to corresponding class', () => {
    const configuration = plainToConfiguration(testMapping as any)

    expect(
      Object.values(configuration.mappingsConfiguration)
        .every(({source, target, connector}) => connector.view && source.view && target.view)
    ).toBeTrue()

    expect(
      Object.values(configuration.constants)
        .every(row => row.view)
    ).toBeTrue()

    expect(
      Object.values(configuration.targetClones)
        .flatMap(table => table)
        .flatMap(value => value.rows)
        .every(row => row.view)
    ).toBeTrue()
  })
})
