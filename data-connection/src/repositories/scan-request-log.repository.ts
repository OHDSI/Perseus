import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {ScanRequestLog, ScanRequestLogRelations} from '../models';

export class ScanRequestLogRepository extends DefaultCrudRepository<
  ScanRequestLog,
  typeof ScanRequestLog.prototype.id,
  ScanRequestLogRelations
> {
  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource,
  ) {
    super(ScanRequestLog, dataSource);
  }
}
