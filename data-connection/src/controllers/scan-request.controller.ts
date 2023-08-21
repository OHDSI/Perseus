import {CoreBindings, inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import debugFactory from 'debug';
import {concatAll, from, map, Observable, tap} from 'rxjs';
import {DataConnectionApplication} from '../application';
import {getOrBindDataSource} from '../business/bind-data-source';
import {
  bindModelDefinitions,
  discoverModelDefinitions
} from '../business/bind-model-definitions';
import {getOrBindProfileRepository} from '../business/bind-profile';
import {ModelProfile, ScanRequest, ScanRequestLog, Status} from '../models';
import {ScanRequestRepository} from '../repositories';
import {LogRepository} from '../repositories/log.repository';
import {ScanRequestLogRepository} from '../repositories/scan-request-log.repository';

const debug = debugFactory('data-connection');
export class ScanRequestController {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: DataConnectionApplication,
    @repository(ScanRequestRepository)
    public scanRequestRepository: ScanRequestRepository,
    @repository(ScanRequestLogRepository)
    public scanRequestLogRepository: ScanRequestLogRepository,
    @repository(LogRepository)
    public logRepository: LogRepository,
  ) {}

  @post('/scan-requests')
  @response(200, {
    description: 'ScanRequest model instance',
    content: {'application/json': {schema: getModelSchemaRef(ScanRequest)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ScanRequest, {
            title: 'NewScanRequest',
            exclude: ['id'],
          }),
        },
      },
    })
    scanRequest: Omit<ScanRequest, 'id'>,
  ): Promise<ScanRequest> {
    const scanRequestEntity = await this.scanRequestRepository.create(
      scanRequest,
    );

    const logPromise = scanRequestEntity.scanParameters?.profile
      ? this.scanProfile(scanRequestEntity)
      : // else
        this.scanModelDefinitions(scanRequestEntity);
    // endif
    logPromise
      .then(logs =>
        logs.subscribe({
          next: log => {
            this.scanRequestLogRepository.create(log).catch(debug);
          },
          complete: () => {
            const log = new ScanRequestLog({
              scanRequestId: scanRequestEntity.id,
              status: Status.COMPLETE,
            });
            this.scanRequestLogRepository.create(log).catch(debug);
          },
        }),
      )
      .catch(debug);

    return scanRequestEntity;
  }

  async scanModelDefinitions(
    scanRequest: ScanRequest,
  ): Promise<Observable<ScanRequestLog>> {
    const discoveryDsKey = scanRequest.dataSourceConfig.connector;
    const discoveryDs = await getOrBindDataSource(
      discoveryDsKey,
      scanRequest.dataSourceConfig,
      this.app,
    );

    return discoverModelDefinitions(discoveryDs).pipe(
      tap(d => bindModelDefinitions(d, discoveryDsKey, this.app)),
      map(d => {
        return new ScanRequestLog({
          scanRequestId: scanRequest.getId(),
          status: Status.IN_PROGRESS,
          modelDefinition: d,
        });
      }),
    );
  }

  async scanProfile(
    scanRequest: ScanRequest,
  ): Promise<Observable<ScanRequestLog>> {
    const profileDsKey = scanRequest.dataSourceConfig.connector;
    await getOrBindDataSource(
      profileDsKey,
      scanRequest.dataSourceConfig,
      this.app,
    );
    const profileRepositoryKey = `profile-${profileDsKey}`;
    const r = await getOrBindProfileRepository(
      profileRepositoryKey,
      profileDsKey,
      this.app,
    );
    return from(r.findLatest()).pipe(
      concatAll(),
      map(p => {
        return new ScanRequestLog({
          scanRequestId: scanRequest.getId(),
          status: Status.IN_PROGRESS,
          modelProfile: p as ModelProfile,
        });
      }),
    );
  }

  @get('/scan-requests/count')
  @response(200, {
    description: 'ScanRequest model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ScanRequest) where?: Where<ScanRequest>,
  ): Promise<Count> {
    return this.scanRequestRepository.count(where);
  }

  @get('/scan-requests')
  @response(200, {
    description: 'Array of ScanRequest model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ScanRequest, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ScanRequest) filter?: Filter<ScanRequest>,
  ): Promise<ScanRequest[]> {
    return this.scanRequestRepository.find(filter);
  }

  @patch('/scan-requests')
  @response(200, {
    description: 'ScanRequest PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ScanRequest, {partial: true}),
        },
      },
    })
    scanRequest: ScanRequest,
    @param.where(ScanRequest) where?: Where<ScanRequest>,
  ): Promise<Count> {
    return this.scanRequestRepository.updateAll(scanRequest, where);
  }

  @get('/scan-requests/{id}')
  @response(200, {
    description: 'ScanRequest model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ScanRequest, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ScanRequest, {exclude: 'where'})
    filter?: FilterExcludingWhere<ScanRequest>,
  ): Promise<ScanRequest> {
    return this.scanRequestRepository.findById(id, filter);
  }

  @patch('/scan-requests/{id}')
  @response(204, {
    description: 'ScanRequest PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ScanRequest, {partial: true}),
        },
      },
    })
    scanRequest: ScanRequest,
  ): Promise<void> {
    await this.scanRequestRepository.updateById(id, scanRequest);
  }

  @put('/scan-requests/{id}')
  @response(204, {
    description: 'ScanRequest PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() scanRequest: ScanRequest,
  ): Promise<void> {
    await this.scanRequestRepository.replaceById(id, scanRequest);
  }

  @del('/scan-requests/{id}')
  @response(204, {
    description: 'ScanRequest DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.scanRequestRepository.deleteById(id);
  }
}
