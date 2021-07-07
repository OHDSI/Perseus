import { WebsocketConfig } from '../../websocket/websocket.config';

export interface WebsocketParams extends WebsocketConfig {
  payload: object;
  itemsToScanCount?: number;
}
