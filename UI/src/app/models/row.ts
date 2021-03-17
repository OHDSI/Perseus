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
  sqlTransformation?: string;
  sqlTransformationActive?: boolean;
  isNullable?: boolean;
  grouppedFields?: IRow[];
  cloneTableName?: string;
  cloneConnectedToSourceName?: string;
  condition?: string;
}

export interface IRow {
  readonly key: string;
  readonly hasConstant;
  readonly hasIncrement;
  readonly hasSqlTransformation;

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
  sqlTransformation: string;
  sqlTransformationActive: boolean;
  isNullable: boolean;
  grouppedFields: IRow[];
  cloneTableName: string;
  cloneConnectedToSourceName: string;
  condition: string;

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
  sqlTransformation: string;
  sqlTransformationActive: boolean;
  isNullable: boolean;
  grouppedFields: IRow[];
  cloneTableName: string;
  cloneConnectedToSourceName: string;
  condition: string;

  get hasConstant(): boolean {
    return this.constant ? true : false;
  }

  get hasIncrement(): boolean {
    return this.increment;
  }

  get hasSqlTransformation(): string {
    return this.sqlTransformation;
  }

  get isRowNullable(): boolean {
    return this.isNullable;
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
    this.isNullable = options.isNullable;
    this.grouppedFields = options.grouppedFields ? options.grouppedFields.map((row: any) => new Row(row)) : [];
    this.cloneTableName = options.cloneTableName;
    this.cloneConnectedToSourceName = options.cloneConnectedToSourceName;
    this.condition = options.condition;
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
