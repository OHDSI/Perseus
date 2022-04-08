import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { EtlConfigurationService } from '@services/etl-configuration.service'
import { saveAs } from 'file-saver';
import { parseHttpError } from '@utils/error'
import { ErrorPopupComponent } from '@popups/error-popup/error-popup.component'
import { withLoading } from '@utils/loading'

@Component({
  selector: 'app-save-mapping-dialog',
  templateUrl: './save-mapping-dialog.component.html',
  styleUrls: ['./save-mapping-dialog.component.scss']
})
export class SaveMappingDialogComponent implements OnInit {
  etlMappingName: string;
  loading = false

  constructor(private dialogRef: MatDialogRef<SaveMappingDialogComponent>,
              private etlConfigurationService: EtlConfigurationService,
              private dialogService: MatDialog) { }

  get disabled() {
    return !this.etlMappingName || this.loading
  }

  ngOnInit(): void {
    this.etlMappingName = this.etlConfigurationService.etlMappingName
  }

  save() {
    this.etlConfigurationService.saveConfiguration(this.etlMappingName)
      .pipe(
        withLoading(this)
      )
      .subscribe(
        file => {
          saveAs(file, `${this.etlMappingName}.etl`)
          this.dialogRef.close(`ETL mapping ${this.etlMappingName} has been saved`)
        },
        error => {
          this.dialogService.open(ErrorPopupComponent, {
            data: {
              title: 'Failed to save ETL mmaping',
              message: parseHttpError(error)
            },
            panelClass: 'perseus-dialog'
          })
        }
      )
  }
}
