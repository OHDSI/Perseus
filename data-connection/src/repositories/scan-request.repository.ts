import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MemoryDataSource} from '../datasources';
import {ScanRequest, ScanRequestRelations, ScanRequestLog} from '../models';
import {ScanRequestLogRepository} from './scan-request-log.repository';

export class ScanRequestRepository extends DefaultCrudRepository<
  ScanRequest,
  typeof ScanRequest.prototype.id,
  ScanRequestRelations
> {

  public readonly logs: HasManyRepositoryFactory<ScanRequestLog, typeof ScanRequest.prototype.id>;

  constructor(
    @inject('datasources.memory') dataSource: MemoryDataSource, @repository.getter('ScanRequestLogRepository') protected scanRequestLogRepositoryGetter: Getter<ScanRequestLogRepository>,
  ) {
    super(ScanRequest, dataSource);
    this.logs = this.createHasManyRepositoryFactoryFor('logs', scanRequestLogRepositoryGetter,);
    this.registerInclusionResolver('logs', this.logs.inclusionResolver);
  }
}
