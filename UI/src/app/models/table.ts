import { IRow } from 'src/app/models/row';

export interface ITable {
    id: number;
    area: string;
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