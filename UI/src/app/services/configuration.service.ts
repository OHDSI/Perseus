import { Injectable } from '@angular/core';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { mappingStateToPlain } from '@utils/configuration';

@Injectable()
export class ConfigurationService {

  constructor(private bridgeService: BridgeService,
              private storeService: StoreService) {}

  saveConfiguration(configurationName: string): Observable<string> {
    if (!configurationName || configurationName.trim().length === 0) {
      return of(`Configuration name has not been entered`);
    }

    const state = {...this.storeService.state}
    const arrowCache = {...this.bridgeService.arrowsCache}
    const constantsCache = {...this.bridgeService.constantsCache}

    const configurationPlain = mappingStateToPlain(configurationName, state, arrowCache, constantsCache)
    const jsonConfiguration = JSON.stringify(configurationPlain);
    const blobConfiguration = new Blob([ jsonConfiguration ], { type: 'application/json' });

    return fromPromise(this.saveOnLocalDisk(blobConfiguration, configurationName))
      .pipe(
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
