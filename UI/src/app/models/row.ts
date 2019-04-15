import { IComment } from 'src/app/models/comment';

export interface IRow {
    id: number;
    tableId: number;
    name: string;
    type: string;
    area: string;
    comments: IComment[];
    visible: boolean;
    connections?: IRow[];
    htmlElement: HTMLElement;

    removeConnections(): void;
}
export class Row {
    constructor(
        public id,
        public tableId,
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