import { IComment } from 'src/app/models/comment';

export interface Area {
    [panelTitle: string]: Panel;
}

export interface Panel {
    [rowName: string]: Row;
}

export interface Row {
    comments: IComment[];
}