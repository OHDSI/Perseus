import { Injectable } from '@angular/core';
import { Configuration } from '@models/configuration';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable()
export class ConfigurationService {

  constructor(
    private bridgeService: BridgeService,
    private storeService: StoreService
  ) {
  }

  saveConfiguration(configurationName: string): Observable<string> {
    if (!configurationName || configurationName.trim().length === 0) {
      return of(`Configuration name has not been entered`);
    }

    return new Observable(subscriber => {
      const newConfiguration = new Configuration({
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
      });

      this.saveOnLocalDisk(newConfiguration)
        .then(content => {
          const zipName = `${configurationName}.etl`
          saveAs(content, zipName);
          subscriber.next(`Configuration ${configurationName} has been saved`)
          subscriber.complete()
        })
        .catch(error => subscriber.error(error))
        .finally(() => subscriber.complete())
    })
  }

  saveOnLocalDisk(newConfiguration: Configuration): Promise<Blob> {
    const config = JSON.stringify(newConfiguration);
    const blobMapping = new Blob([ config ], { type: 'application/json' });
    return this.createZip(
      [ blobMapping, this.storeService.state.reportFile ],
      [ `${newConfiguration.name}.json`, this.storeService.state.report ]
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
