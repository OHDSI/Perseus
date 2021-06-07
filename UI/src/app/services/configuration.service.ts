import { Injectable } from '@angular/core';
import { Configuration } from '@models/configuration';
import { BridgeService } from './bridge.service';
import { StoreService } from './store.service';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

@Injectable()
export class ConfigurationService {

  constructor(
    private bridgeService: BridgeService,
    private storeService: StoreService
  ) {
  }

  saveConfiguration(configurationName: string): string {
    if (!configurationName || configurationName.trim().length === 0) {
      return `Configuration name has not been entered`;
    }

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

    this.saveOnLocalDisk(newConfiguration);

    return `Configuration ${configurationName} has been saved`;
  }

  saveOnLocalDisk(newConfiguration: Configuration) {
    const config = JSON.stringify(newConfiguration);
    const blobMapping = new Blob([ config ], { type: 'application/json' });
    this.createZip([ blobMapping, this.storeService.state.reportFile ], [ `${newConfiguration.name}.json`, this.storeService.state.report ], newConfiguration.name)
  }

  async createZip(files: any[], names: any[], zipName: string) {
    const zip = new JSZip();
    const name = zipName + '.etl';
    files.forEach((item, index) => {
      zip.file(names[ index ], item);
    })
    zip.generateAsync({ type: 'blob' , compression: 'DEFLATE'}).then((content) => {
      if (content) {
        saveAs(content, name);
      }
    });
  }
}
