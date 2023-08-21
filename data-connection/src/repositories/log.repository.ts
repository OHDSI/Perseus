import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {Log, LogRelations} from '../models';

export class LogRepository extends DefaultCrudRepository<
  Log,
  typeof Log.prototype.id,
  LogRelations
> {
  constructor(@inject('datasources.memory') dataSource: MemoryDataSource) {
    super(Log, dataSource);
  }
}
