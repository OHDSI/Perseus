import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SavedMappingsComponent } from '../../comfy/saved-mappings/saved-mappings.component';
import { Configuration } from 'src/app/models/configuration';
import { BridgeService } from 'src/app/services/bridge.service';

@Component({
  selector: 'app-save-mapping-dialog',
  templateUrl: './open-mapping-dialog.component.html',
  styleUrls: ['./open-mapping-dialog.component.scss']
})
export class OpenMappingDialogComponent implements OnInit {
  @ViewChild(SavedMappingsComponent, { static: true }) controller: SavedMappingsComponent;

  target = {};
  action = '';

  configurationName = '';
  selectedConfiguration: Configuration;

  constructor(
    public dialogRef: MatDialogRef<OpenMappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bridgeService: BridgeService
  ) {
    this.action = data.action;
    this.target = data.target;
  }

  ngOnInit() {}

  onSelectConfiguration(configuration: Configuration) {
    this.selectedConfiguration = configuration;
  }

  openConfiguration() {
    const configuration = this.selectedConfiguration;
    this.bridgeService.applyConfiguration(configuration);
    this.configurationName = configuration.name;
  }

  saveConfiguration() {
    const configurationName = this.controller.configurationControl.value;
    this.controller.saveConfiguration(configurationName);
    this.configurationName = configurationName;
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
