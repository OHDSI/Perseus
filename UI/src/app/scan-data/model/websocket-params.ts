import { WebsocketConfig } from '../../websocket/websocket.config';

export interface WebsocketParams extends WebsocketConfig {
  progressMessagesDestination?: string;
  resultDestination?: string;
  payload: object;
  itemsToScanCount?: number;
}
