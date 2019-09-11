import {
  Component,
  OnInit,
  assertPlatform,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BridgeService } from 'src/app/services/bridge.service';
import { Configuration } from 'src/app/models/configuration';
import { MatSnackBar } from '@angular/material';
import { IMappingsStorage } from 'src/app/models/interface/mappings-storage';
import { BrowserSessionStorage } from 'src/app/models/implementation/browser-session-mappings-storage';

@Component({
  selector: 'app-saved-mappings',
  templateUrl: './saved-mappings.component.html',
  styleUrls: ['./saved-mappings.component.scss']
})
export class SavedMappingsComponent implements OnInit {
  @Input() action: string;
  @Input() tablesconfiguration: any;
  @Output() select = new EventEmitter<Configuration>();

  formControl = new FormControl();
  configurationControl = new FormControl();

  configurations = [];

  private snakbarOptions = {
    duration: 3000
  };

  mappingsService: IMappingsStorage;

  constructor(
    private bridgeService: BridgeService,
    private snakbar: MatSnackBar
  ) {
    this.mappingsService = new BrowserSessionStorage();
  }

  ngOnInit() {
    this.configurations = [...Object.values(this.mappingsService.configuration)];
  }

  openedChangeHandler(open: any) {
    if (open) {
      setTimeout(() => {
        this.formControl.setValue([...this.configurations]);
      }, 0);
    }
  }

  onOpenConfiguration(configuration: Configuration) {
    const config = this.mappingsService.open(configuration.name);
    if (config) {
    } else {
      alert('config not found');
    }

    this.snakbar.open(
      `Configuration ${config.name} has been loaded`,
      ' DISMISS ',
      this.snakbarOptions
    );

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

    this.mappingsService.save(newConfiguration);
    this.configurations = [...Object.values(this.mappingsService.configuration)];
    this.configurationControl.reset();

    this.snakbar.open(
      `Configuration ${configurationName} has been saved`,
      ' DISMISS ',
      this.snakbarOptions
    );
  }
}
