import { IArrowCache } from '@models/arrow-cache';
import { State } from '@models/state';
import { EtlConfiguration, IEtlConfiguration } from '@models/etl-configuration';
import { IConstantCache } from '@models/constant-cache';
import { classToPlain, plainToClass } from 'class-transformer';
import { Connection } from '@models/connection';
import { Row } from '@models/row';
import { Table } from '@models/table';

/**
 * @return EtlConfiguration - Flyweight mapping object to save to a file
 */
export function mappingStateToPlain(configurationName: string,
                                    state: State,
                                    arrowCache: IArrowCache,
                                    constantsCache: IConstantCache): Record<string, EtlConfiguration> {
  const options: IEtlConfiguration = {
    etlMapping: state.etlMapping,
    name: configurationName,
    mappingsConfiguration: arrowCache,
    tablesConfiguration: state.targetConfig,
    source: state.source,
    target: state.target,
    filtered: state.filtered,
    constants: constantsCache,
    targetClones: state.targetClones,
    sourceSimilar: state.sourceSimilar,
    targetSimilar: state.targetSimilar,
    recalculateSimilar: state.recalculateSimilar,
    concepts: state.concepts
  }
  const configuration = new EtlConfiguration(options)
  return classToPlain<EtlConfiguration>(configuration)
}

export function plainToConfiguration(plain: Record<string, EtlConfiguration>): EtlConfiguration {
  const configuration = plainToClass(EtlConfiguration, plain)
  // Type decorator doesn't work with index fields
  const mapProperties = {
    mappingsConfiguration: Connection,
    constants: Row,
    targetClones: Table
  }
  for (const property of Object.keys(mapProperties)) {
    Object.keys(configuration[property]).forEach(key => {
      const ref = mapProperties[property]
      configuration[property][key] = plainToClass(ref, configuration[property][key])
    })
  }

  return configuration
}
