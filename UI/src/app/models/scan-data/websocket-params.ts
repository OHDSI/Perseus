import { WebsocketConfig } from '@websocket/websocket.config';

/**
 * @deprecated
 */
export interface WebsocketParams extends WebsocketConfig {
  payload: object;
  itemsToScanCount?: number;
}
