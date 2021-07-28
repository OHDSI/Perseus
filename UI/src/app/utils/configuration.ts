import { IArrowCache } from '@models/arrow-cache';
import { State } from '@models/state';
import { Configuration, IConfiguration } from '@models/configuration';
import { IConstantCache } from '@models/constant-cache';
import { classToPlain, plainToClass } from 'class-transformer';
import { Connection } from '@models/connection';
import { Row } from '@models/row';
import { Table } from '@models/table';

/**
 * @return Configuration - Flyweight mapping object to save to a file
 */
export function mappingStateToPlain(configurationName: string,
                                    state: State,
                                    arrowCache: IArrowCache,
                                    constantsCache: IConstantCache): Record<string, Configuration> {
  const options: IConfiguration = {
    name: configurationName,
    mappingsConfiguration: arrowCache,
    tablesConfiguration: state.targetConfig,
    source: state.source,
    target: state.target,
    report: state.report,
    version: state.version,
    filtered: state.filtered,
    constants: constantsCache,
    targetClones: state.targetClones,
    sourceSimilar: state.sourceSimilar,
    targetSimilar: state.targetSimilar,
    recalculateSimilar: state.recalculateSimilar,
    concepts: state.concepts
  }
  const configuration = new Configuration(options)
  return classToPlain<Configuration>(configuration)
}

export function plainToConfiguration(plain: Record<string, Configuration>): Configuration {
  const configuration = plainToClass(Configuration, plain)
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
