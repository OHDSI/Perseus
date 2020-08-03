import { Injectable } from '@angular/core';
import { IStorage } from '../models/interface/storage.interface';
import { Configuration } from '../models/configuration';
import { BridgeService } from './bridge.service';
import { BrowserSessionConfigurationStorage } from '../models/implementation/configuration-session-storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

    configStorageService: IStorage<Configuration>;
    configurations = [];
    private snakbarOptions = {
        duration: 3000
      };

    constructor(
        private bridgeService: BridgeService,
        private snakbar: MatSnackBar,
        private storeService: StoreService
    ) {
        this.configStorageService = new BrowserSessionConfigurationStorage('configurations');
        this.configurations = [...Object.values(this.configStorageService.configuration)];
    }

    openConfiguration(configurationName: string) {
        const config = this.configStorageService.open(configurationName);
        if (!config) {
            this.snakbar.open(
                `Configuration ${configurationName} not found`,
                ' DISMISS ',
                this.snakbarOptions
              );
            return;
        }

        this.snakbar.open(
          `Configuration ${config.name} has been loaded`,
          ' DISMISS ',
          this.snakbarOptions
        );
        this.bridgeService.applyConfiguration(config);
      }

      saveConfiguration(configurationName: string) {
        if (!configurationName || configurationName.length === 0) {
            this.snakbar.open(
                `Configuration name has not been entered`,
                ' DISMISS ',
                this.snakbarOptions
              );
            return;
        }

        const newConfiguration = new Configuration({
          name: configurationName,
          mappingsConfiguration: this.bridgeService.arrowsCache,
          tablesConfiguration: this.storeService.state.targetConfig
        });

        this.configStorageService.save(newConfiguration);
        this.configurations = [...Object.values(this.configStorageService.configuration)];

        this.snakbar.open(
          `Configuration ${configurationName} has been saved`,
          ' DISMISS ',
          this.snakbarOptions
        );
      }
}
