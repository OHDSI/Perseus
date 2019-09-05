import { Component, OnInit, assertPlatform, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BridgeService } from 'src/app/services/bridge.service';
import { SavedMappingService } from 'src/app/services/saved-mappings.service';
import { SavedMapping } from 'src/app/models/saved-mapping';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-saved-mappings',
  templateUrl: './saved-mappings.component.html',
  styleUrls: ['./saved-mappings.component.scss']
})
export class SavedMappingsComponent implements OnInit {
  @Output() reset = new EventEmitter();

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
  ) {

  }

  ngOnInit() {}

  openedChangeHandler(open: any) {
    if (open) {
      setTimeout(() => {
        this.formControl.setValue([...this.configurations]);
      }, 0);
    }
  }

  onOpenConfiguration(event: any, config: SavedMapping) {
    const mapping = this.savedMappinds.open(config.name);
    if (mapping) {
      const arrowsCache = JSON.parse(mapping.payload);
      this.bridgeService.applyConfiguration(arrowsCache);
    } else {
      alert('config not found');
    }

    this.snakbar.open(`Configuration ${config.name} has been applyed`, ' DISMISS ', this.snakbarOptions);
  }

  saveConfiguration(configurationName: string) {
    const payload = JSON.stringify(this.bridgeService.arrowsCache);
    const newConfiguration = new SavedMapping({ name: configurationName, payload });
    this.savedMappinds.save(newConfiguration);
    this.configurations = [...this.savedMappinds.mappingConfigurations];

    this.snakbar.open(`Configuration ${configurationName} has been saved`, ' DISMISS ', this.snakbarOptions);
  }

  resetAllMappings() {
    this.bridgeService.resetAllArrows();

    this.reset.emit();

    this.snakbar.open(`Reset all mappings success`, ' DISMISS ', this.snakbarOptions);
  }
}
