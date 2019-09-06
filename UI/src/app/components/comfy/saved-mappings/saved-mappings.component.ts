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
import { SavedMappingService } from 'src/app/services/saved-mappings.service';
import { Configuration } from 'src/app/models/configuration';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-saved-mappings',
  templateUrl: './saved-mappings.component.html',
  styleUrls: ['./saved-mappings.component.scss']
})
export class SavedMappingsComponent implements OnInit {
  @Input() tablesconfiguration: any;

  @Output() load = new EventEmitter<Configuration>();

  formControl = new FormControl();
  configurationControl = new FormControl();

  configurations = [];

  private snakbarOptions = {
    duration: 3000
  };

  constructor(
    private bridgeService: BridgeService,
    private savedMappinds: SavedMappingService,
    private snakbar: MatSnackBar
  ) {}

  ngOnInit() {}

  openedChangeHandler(open: any) {
    if (open) {
      setTimeout(() => {
        this.formControl.setValue([...this.configurations]);
      }, 0);
    }
  }

  onOpenConfiguration(event: any, configuration: Configuration) {
    const config = this.savedMappinds.open(configuration.name);
    if (config) {
      this.load.emit(config);
    } else {
      alert('config not found');
    }

    this.snakbar.open(
      `Configuration ${config.name} has been loaded`,
      ' DISMISS ',
      this.snakbarOptions
    );
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

    this.savedMappinds.save(newConfiguration);
    this.configurations = [...this.savedMappinds.mappingConfigurations];
    this.configurationControl.reset();

    this.snakbar.open(
      `Configuration ${configurationName} has been saved`,
      ' DISMISS ',
      this.snakbarOptions
    );
  }
}
