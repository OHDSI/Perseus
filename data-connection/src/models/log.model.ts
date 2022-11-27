import {Entity, model, property} from '@loopback/repository';

@model()
export class Log extends Entity {

  @property({
    type: 'number',
    id: true,
    // required: true,
  })
  id: number;

  @property({
    type: 'object',
  })
  error?: object;


  constructor(data?: Partial<Log>) {
    super(data);
  }
}

export interface LogRelations {
  // describe navigational properties here
}

export type LogWithRelations = Log & LogRelations;
