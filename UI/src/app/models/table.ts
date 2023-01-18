import { IRow, Row } from 'src/app/models/row';
import { Area } from './area';
import { Type } from 'class-transformer';

export interface ITable {
  id: number;
  area: Area;
  name: string;
  rows: IRow[];
  visible: boolean;
  sql: string;
  cloneName: string;
  condition: string;
  cloneConnectedToSourceName: string;
  settings?: any; // SCAFFOLDING. DELETE AFTER PROP WILL BE IMPLEMENTED ON BACK-END
}


export interface ITableOptions {
  id?: number;
  area?: Area;
  name?: string;
  rows?: IRow[];
  visible?: boolean;
  sql?: string;
  cloneName?: string;
  condition?: string;
  cloneConnectedToSourceName?: string;
}

export class Table implements ITable {
  id: number;
  area: Area;
  name: string;

  @Type(() => Row)
  rows: IRow[];

  visible = true;
  sql: string;
  cloneName: string;
  condition: string;
  cloneConnectedToSourceName: string;

  constructor(options: ITableOptions = {}) {
    this.id = options.id;
    this.area = options.area;
    this.name = options.name;
    this.rows = options.rows ? options.rows.map((row: any) => new Row(row)) : [];
    this.visible = options.visible || true;
    this.sql = options.sql || '';
    this.cloneName = options.cloneName;
    this.condition = options.condition;
    this.cloneConnectedToSourceName = options.cloneConnectedToSourceName;
  }
}
