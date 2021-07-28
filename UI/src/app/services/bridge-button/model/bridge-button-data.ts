import { IConnector } from '@models/connector';
import { IArrowCache } from 'src/app/models/arrow-cache';

export interface BridgeButtonData {
  connector: IConnector;
  arrowCache: IArrowCache;
}
