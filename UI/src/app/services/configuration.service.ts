import { Injectable } from '@angular/core';
import { ConfigurationOptions } from '@models/configuration';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { HttpService } from '@services/http.service';
import { map, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable()
export class ConfigurationService {

  constructor(
    private bridgeService: BridgeService,
    private storeService: StoreService,
    private httpService: HttpService
  ) {
  }

  saveConfiguration(configurationName: string): Observable<string> {
    if (!configurationName || configurationName.trim().length === 0) {
      return of(`Configuration name has not been entered`);
    }

    const options: ConfigurationOptions = {
      name: configurationName,
      mappingsConfiguration: this.bridgeService.arrowsCache,
      tablesConfiguration: this.storeService.state.targetConfig,
      source: this.storeService.state.source,
      target: this.storeService.state.target,
      report: this.storeService.state.report,
      version: this.storeService.state.version,
      filtered: this.storeService.state.filtered,
      constants: this.bridgeService.constantsCache,
      targetClones: this.storeService.state.targetClones,
      sourceSimilar: this.storeService.state.sourceSimilar,
      targetSimilar: this.storeService.state.targetSimilar,
      recalculateSimilar: this.storeService.state.recalculateSimilar,
      concepts: this.storeService.state.concepts
    }

    return this.httpService.configurationByMappingOptions(options)
      .pipe(
        switchMap(blob => fromPromise(this.saveOnLocalDisk(blob, configurationName))),
        map(zip => {
          const zipName = `${configurationName}.etl`
          saveAs(zip, zipName);
          return `Configuration ${configurationName} has been saved`
        })
      )
  }

  saveOnLocalDisk(blobMapping: Blob, configurationName: string): Promise<Blob> {
    return this.createZip(
      [ blobMapping, this.storeService.state.reportFile ],
      [ `${configurationName}.json`, this.storeService.state.report ]
    )
  }

  createZip(files: any[], names: any[]): Promise<Blob> {
    const zip = new JSZip();
    files.forEach((item, index) => {
      zip.file(names[ index ], item);
    })
    return zip.generateAsync({ type: 'blob' , compression: 'DEFLATE'})
  }
}
