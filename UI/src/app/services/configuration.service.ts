import { Injectable } from '@angular/core';
import { IStorage } from '../models/interface/storage.interface';
import { Configuration } from '../models/configuration';
import { BridgeService } from './bridge.service';
import { BrowserSessionConfigurationStorage } from '../models/implementation/configuration-session-storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreService } from './store.service';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  configStorageService: IStorage<Configuration>;
  configurations = [];

  constructor(
    private bridgeService: BridgeService,
    private storeService: StoreService
  ) {
    this.configStorageService = new BrowserSessionConfigurationStorage('configurations');
    this.configurations = [ ...Object.values(this.configStorageService.configuration) ];
  }

  openConfiguration(configurationName: string): string {
    const config = this.configStorageService.open(configurationName);
    if (!config) {
      return `Configuration ${configurationName} not found`;
    }
    this.bridgeService.applyConfiguration(config);
    return `Configuration ${config.name} has been loaded`;
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
      filtered: this.storeService.state.filtered
    });

    this.saveOnLocalDisk(newConfiguration);

    return `Configuration ${configurationName} has been saved`;
  }


  saveInLocalStorage(newConfiguration: Configuration) {
    this.configStorageService.save(newConfiguration);
    this.configurations = [ ...Object.values(this.configStorageService.configuration) ];
  }

  saveOnLocalDisk(newConfiguration: Configuration) {
    const config = JSON.stringify(newConfiguration);
    const blob = new Blob([ config ], { type: 'application/json' });
    saveAs(blob, `${newConfiguration.name}.json`);
  }

}
