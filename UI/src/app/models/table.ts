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
export class Table {
    constructor(
        public id,
        public area,
        public name,
        public rows,
        public visible = true,
        public expanded = false
    ) { }
}
