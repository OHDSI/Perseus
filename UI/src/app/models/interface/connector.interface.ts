import { IRow } from '../row';

export interface IConnector {
  id: string;
  canvas: any;
  line: Element;
  source: IRow;
  target: IRow;
  selected: boolean;
  draw(): void;
  remove(): void;
  adjustPosition(): void;
  attachButton(button): void;
}
