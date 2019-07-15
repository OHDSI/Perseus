import { IComment } from 'src/app/models/comment';
import { Area } from 'src/app/components/area/area.component';

export interface IRow {
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
    ) { }

    removeConnections() {
        this.connections = [];
    }
}