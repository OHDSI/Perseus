import { Component, OnInit, assertPlatform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BridgeService } from 'src/app/services/bridge.service';
import { SavedMappingService } from 'src/app/services/saved-mappings.service';
import { SavedMapping } from 'src/app/models/saved-mapping';

@Component({
  selector: 'app-saved-mappings',
  templateUrl: './saved-mappings.component.html',
  styleUrls: ['./saved-mappings.component.scss']
})
export class SavedMappingsComponent implements OnInit {
  formControl = new FormControl();
  configurations = [];

  constructor(
    private bridgeService: BridgeService,
    private savedMappinds: SavedMappingService
  ) {}

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
  }
  count = 0;

  saveConfiguration() {
    const payload = JSON.stringify(this.bridgeService.arrowsCache);
    const newConfiguration = new SavedMapping({ name: `test ${this.count++}`, payload });
    this.savedMappinds.save(newConfiguration);
    this.configurations = [...this.savedMappinds.mappingConfigurations];
  }
}
