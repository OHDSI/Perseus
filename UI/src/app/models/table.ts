import { IRow } from 'src/app/models/row';
import { Area } from './area';

export interface ITable {
    id: number;
    area: Area;
    name: string;
    rows: IRow[];
    visible: boolean;
    expanded: boolean;
}


export interface ITableOptions {
  id?: number;
  area?: Area;
  name?: string;
  rows?: IRow[];
  visible?: boolean;
  expanded?: boolean;
}

export class Table {
   id: number;
   area: Area;
   name: string;
   rows: IRow[];
   visible = true;
   expanded = false;

  constructor(options: ITableOptions = {}) {
    this.id = options.id;
    this.area = options.area;
    this.name = options.name;
    this.rows = options.rows;
    this.visible = options.visible || true;
    this.expanded = options.expanded || false;
   }
}
