import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DataService } from '../../../services/data.service';
import { SavedMappingsComponent } from '../../comfy/saved-mappings/saved-mappings.component';

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
    private dataService: DataService
  ) {
    this.dataService.getCDMVersions().subscribe(res => {
      this.versions = res;
      this.selectedVersion = this.versions[0];
    });
  }

  ngOnInit() {
    this.versionElement.focus();
  }

}
