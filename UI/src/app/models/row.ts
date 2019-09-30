import { IComment } from 'src/app/models/comment';
import { Area } from './area';

export interface RowOptions {
  id?: number;
  tableId?: number;
  tableName?: string;
  name?: string;
  type?: string;
  area?: Area;
  values?: any[];
  comments?: IComment[];
  visible?: boolean;
  htmlElement?: any;
  constant?: string;
}

export interface IRow {
  readonly key: string;
  readonly hasConstant;

  id: number;
  tableId: number;
  tableName: string;
  name: string;
  type: string;
  area: Area;
  values: any[];
  comments: IComment[];
  visible?: boolean;
  htmlElement: any;
  constant: string;
  removeConnections(): void;
}
export class Row {
  id: number;
  tableId: number;
  tableName: string;
  name: string;
  type: string;
  area: string;
  comments: IComment[];
  constant: string;

  visible = true;
  connections = [];
  htmlElement: any = null;

  get hasConstant(): boolean {
    return this.constant ? true : false;
  }

  get key(): string {
    return `${this.tableName}-${this.name}`;
  }

  constructor(options: RowOptions = {}) {
    this.id = options.id;
    this.tableId = options.tableId;
    this.tableName = options.tableName;
    this.name = options.name;
    this.type = options.type;
    this.area = options.area;
    this.comments = options.comments;
    this.constant = options.constant;
  }

  removeConnections() {
    this.connections = [];
  }

  toString(): string {
    return `id:${this.id} table:${this.tableId} tablename:${this.tableName}
       name:${this.name} type:${this.type} area:${this.area} comments:${this.comments} visible:${this.visible}`;
  }
}
