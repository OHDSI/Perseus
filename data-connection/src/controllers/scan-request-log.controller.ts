import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  ScanRequest,
  ScanRequestLog
} from '../models';
import {ScanRequestRepository} from '../repositories';

export class ScanRequestLogController {
  constructor(
    @repository(ScanRequestRepository) protected scanRequestRepository: ScanRequestRepository,
  ) { }

  @get('/scan-requests/{id}/scan-request-logs', {
    responses: {
      '200': {
        description: 'Array of ScanRequest has many ScanRequestLog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ScanRequestLog)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ScanRequestLog>,
  ): Promise<ScanRequestLog[]> {
    return this.scanRequestRepository.logs(id).find(filter);
  }

  @post('/scan-requests/{id}/scan-request-logs', {
    responses: {
      '200': {
        description: 'ScanRequest model instance',
        content: {'application/json': {schema: getModelSchemaRef(ScanRequestLog)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof ScanRequest.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ScanRequestLog, {
            title: 'NewScanRequestLogInScanRequest',
            exclude: ['id'],
            optional: ['scanRequestId']
          }),
        },
      },
    }) scanRequestLog: Omit<ScanRequestLog, 'id'>,
  ): Promise<ScanRequestLog> {
    return this.scanRequestRepository.logs(id).create(scanRequestLog);
  }

  @patch('/scan-requests/{id}/scan-request-logs', {
    responses: {
      '200': {
        description: 'ScanRequest.ScanRequestLog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ScanRequestLog, {partial: true}),
        },
      },
    })
    scanRequestLog: Partial<ScanRequestLog>,
    @param.query.object('where', getWhereSchemaFor(ScanRequestLog)) where?: Where<ScanRequestLog>,
  ): Promise<Count> {
    return this.scanRequestRepository.logs(id).patch(scanRequestLog, where);
  }

  @del('/scan-requests/{id}/scan-request-logs', {
    responses: {
      '200': {
        description: 'ScanRequest.ScanRequestLog DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ScanRequestLog)) where?: Where<ScanRequestLog>,
  ): Promise<Count> {
    return this.scanRequestRepository.logs(id).delete(where);
  }
}
