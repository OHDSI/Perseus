import { IConnector } from 'src/app/models/interface/connector.interface';
import { ArrowCache } from 'src/app/models/arrow-cache';

export interface TransformRulesData {
  connector: IConnector;
  arrowCache: ArrowCache;
}
