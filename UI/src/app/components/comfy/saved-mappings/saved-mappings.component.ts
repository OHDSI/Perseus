import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Configuration } from 'src/app/models/configuration';
import { BrowserSessionConfigurationStorage } from 'src/app/models/implementation/configuration-session-storage';
import { IStorage } from 'src/app/models/interface/storage.interface';
import { BridgeService } from 'src/app/services/bridge.service';


@Component({
  selector: 'app-saved-mappings',
  templateUrl: './saved-mappings.component.html',
  styleUrls: [ './saved-mappings.component.scss' ]
})
export class SavedMappingsComponent implements OnInit {
  @Input() action: string;
  @Input() tablesconfiguration: any;
  @Output() select = new EventEmitter<Configuration>();

  formControl = new FormControl();
  configurationControl = new FormControl();
  configurations = [];
  configStorageService: IStorage<Configuration>;

  constructor(
    private bridgeService: BridgeService,
    private snackbar: MatSnackBar
  ) {
    this.configStorageService = new BrowserSessionConfigurationStorage('configurations');
  }

  ngOnInit() {
    this.configurations = [ ...Object.values(this.configStorageService.configuration) ];
  }

  openedChangeHandler(open: any) {
    if (open) {
      setTimeout(() => {
        this.formControl.setValue([ ...this.configurations ]);
      }, 0);
    }
  }

  onOpenConfiguration(configuration: Configuration) {
    const config = this.configStorageService.open(configuration.name);
    if (config) {
    } else {
      alert('config not found');
    }

    this.snackbar.open(`Configuration ${config.name} has been loaded`, ' DISMISS ');

    this.select.emit(configuration);
  }

  saveConfiguration(configurationName: string) {
    if (!configurationName || configurationName.length === 0) {
      alert('configuration name should be');
      return;
    }

    const newConfiguration = new Configuration({
      name: configurationName,
      mappingsConfiguration: this.bridgeService.arrowsCache,
      tablesConfiguration: this.tablesconfiguration
    });

    this.configStorageService.save(newConfiguration);
    this.configurations = [ ...Object.values(this.configStorageService.configuration) ];
    this.configurationControl.reset();

    this.snackbar.open(`Configuration ${configurationName} has been saved`, ' DISMISS ');
  }
}
