import { IRow, Row } from 'src/app/models/row';
import { Area } from './area';

export interface ITable {
  id: number;
  area: Area;
  name: string;
  rows: IRow[];
  visible: boolean;
  sql: string;
  cloneName: string;
}


export interface ITableOptions {
  id?: number;
  area?: Area;
  name?: string;
  rows?: IRow[];
  visible?: boolean;
  sql?: string;
  cloneName?: string;
}

export class Table {
  id: number;
  area: Area;
  name: string;
  rows: IRow[];
  visible = true;
  sql: string;
  cloneName: string;

  constructor(options: ITableOptions = {}) {
    this.id = options.id;
    this.area = options.area;
    this.name = options.name;
    this.rows = options.rows ? options.rows.map((row: any) => new Row(row)) : [];
    this.visible = options.visible || true;
    this.sql = options.sql || '';
    this.cloneName = options.cloneName;
  }
}
