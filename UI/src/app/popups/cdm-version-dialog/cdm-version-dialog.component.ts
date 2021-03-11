import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DataService } from '../../services/data.service';
import { SavedMappingsComponent } from '../saved-mappings/saved-mappings.component';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-cdm-version-dialog',
  templateUrl: './cdm-version-dialog.component.html',
  styleUrls: ['./cdm-version-dialog.component.scss']
})
export class CdmVersionDialogComponent implements OnInit {
  @ViewChild(SavedMappingsComponent, { static: true }) controller: SavedMappingsComponent;
  @ViewChild('version', { static: true }) versionElement: MatSelect;
  versions = [];
  selectedVersion;

  constructor(
    public dialogRef: MatDialogRef<CdmVersionDialogComponent>,
    private dataService: DataService,
    private storeService: StoreService
  ) {
    this.versions = this.storeService.state.cdmVersions;
    this.selectedVersion = this.versions[ 0 ];
  }

  ngOnInit() {
    this.versionElement.focus();
  }

}
