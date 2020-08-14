import { IComment } from 'src/app/models/comment';
import { Area } from './area';
import { ConnectorType } from './interface/connector.interface';

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
  increment?: boolean;
  selected?: boolean;
  uniqueIdentifier?: boolean;
}

export interface IRow {
  readonly key: string;
  readonly hasConstant;
  readonly hasIncrement;

  id: number;
  tableId: number;
  tableName: string;
  name: string;
  type: string;
  area: string;
  values: any[];
  comments: IComment[];
  visible?: boolean;
  htmlElement: any;
  constant: string;
  increment: boolean;
  selected: boolean;
  connectorTypes: ConnectorType[];
  uniqueIdentifier: boolean;

  removeConnections(): void;
  setType(type: ConnectorType): void;
}

export class Row implements IRow {
  id: number;
  tableId: number;
  tableName: string;
  name: string;
  type: string;
  area: string;
  comments: IComment[];
  constant: string;
  increment: boolean;
  values: any[];
  visible = true;
  connections = [];
  htmlElement: any = null;
  selected: boolean;
  connectorTypes: ConnectorType[];
  uniqueIdentifier: boolean;

  get hasConstant(): boolean {
    return this.constant ? true : false;
  }

  get hasIncrement(): boolean {
    return this.increment;
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
    this.increment = options.increment;
    this.selected = options.selected || false;
    this.connectorTypes = [];
    this.uniqueIdentifier = options.uniqueIdentifier;
  }

  removeConnections() {
    this.connections = [];
  }

  setType(type: ConnectorType) {
    const idx = this.connectorTypes.findIndex(existingType => existingType === type);
    if (idx === -1) {
      this.connectorTypes.push(type);
    }
  }

  toString(): string {
    return `id:${this.id} table:${this.tableId} tablename:${this.tableName}
       name:${this.name} type:${this.type} area:${this.area} comments:${this.comments} visible:${this.visible}`;
  }
}
