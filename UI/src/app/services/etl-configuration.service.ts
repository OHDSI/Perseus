import { Injectable } from '@angular/core';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';
import { Observable } from 'rxjs';
import { mappingStateToPlain } from '@utils/etl-configuration-util';
import { PerseusApiService } from '@services/perseus/perseus-api.service'
import { GenerateEtlArchiveRequest } from '@models/perseus/generate-etl-archive-request'

@Injectable()
export class EtlConfigurationService {

  constructor(private bridgeService: BridgeService,
              private storeService: StoreService,
              private perseusApiService: PerseusApiService) {}

  get etlMappingName(): string | null {
    const etlMapping = this.storeService.etlMapping
    return etlMapping ? `${etlMapping.source_schema_name}` : null
  }

  saveConfiguration(configurationName: string): Observable<Blob> {
    const state = {...this.storeService.state}
    const arrowCache = {...this.bridgeService.arrowsCache}
    const constantsCache = {...this.bridgeService.constantsCache}
    const configurationPlain = mappingStateToPlain(configurationName, state, arrowCache, constantsCache)

    const request: GenerateEtlArchiveRequest = {
      name: configurationName,
      etl_mapping_id: this.storeService.etlMappingId,
      etl_configuration: configurationPlain
    }

    return this.perseusApiService.generateEtlMappingArchive(request)
  }
}
