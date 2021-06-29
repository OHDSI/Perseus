import { ArrowCache, ArrowCacheState, ConstantCache } from '@models/arrow-cache';
import { State } from '@models/state';
import { Configuration, ConfigurationOptions } from '@models/configuration';
import { IConnector, IConnectorState } from '@models/connector.interface';
import { IRow, IRowState } from '@models/row';

export function mappingStateToConfiguration(configurationName: string,
                                            state: State,
                                            arrowCache: ArrowCache,
                                            constantsCache: ConstantCache): Configuration {
  const options: ConfigurationOptions = {
    name: configurationName,
    mappingsConfiguration: arrowCacheToState(arrowCache),
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

  return new Configuration(options)
}

function arrowCacheToState(arrowCache: ArrowCache): ArrowCacheState {
  const result = {}
  Object.keys(arrowCache).forEach(key => {
    const {source, target, connector, transforms, lookup, type, sql} = arrowCache[key]
    result[key] = {
      source: rowToState(source),
      target: rowToState(target),
      connector: connectorToState(connector),
      transforms,
      lookup,
      type,
      sql
    }
  })
  return result
}

function rowToState(row: IRow): IRowState {
  const copy = {...row}
  delete copy.htmlElement

  return copy as IRowState
}

function connectorToState(connector: IConnector): IConnectorState {
  const {id, source, target, selected, type} = connector
  return {
    id,
    source: rowToState(source),
    target: rowToState(target),
    selected,
    type
  }
}
