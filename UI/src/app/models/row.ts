import { IComment } from 'src/app/models/comment';
import { Area } from './area';

export interface IRow {
  readonly key: string;
  id: number;
  tableId: number;
  tableName: string;
  name: string;
  type: string;
  area: Area;
  values: any[];
  comments: IComment[];
  visible?: boolean;
  connections?: IRow[];
  htmlElement: any;

  removeConnections(): void;
}
export class Row {
  get key(): string {
    return `${this.tableName}-${this.name}`;
  }

  constructor(
    public id,
    public tableId,
    public tableName,
    public name,
    public type,
    public area,
    public comments,
    public visible = true,
    public connections = [],
    public htmlElement = null
  ) {}

  removeConnections() {
    this.connections = [];
  }

  toString(): string {
    return `id:${this.id} table:${this.tableId} tablename:${this.tableName}
       name:${this.name} type:${this.type} area:${this.area} comments:${
      this.comments
    } visible:${this.visible}`;
  }
}
