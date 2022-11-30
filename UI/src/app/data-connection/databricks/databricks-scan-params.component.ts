import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataConnectionScanParamsComponent } from '../data-connection-scan-params.component';

@Component({
  templateUrl: './databricks-scan-params.component.html',
  styleUrls: [
    './databricks-scan-params.component.scss',
    '../../scan-data/styles/scan-data-form.scss'
  ],
})
export class DatabricksScanParamsComponent implements DataConnectionScanParamsComponent, OnInit {

  scanParamsForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.scanParamsForm = this.formBuilder.group({
      runAsJob: new FormControl(false),
      notebookPath: {}
    });
  }

  maxDistinctValues = [
    {
      value: 100,
      viewValue: '100'
    },
    {
      value: 1e3,
      viewValue: '1,000'
    },
    {
      value: 10e3,
      viewValue: '10,000'
    }
  ];

  rowsPerTableValues = [
    {
      value: 100e3,
      viewValue: '100,000'
    },
    {
      value: 500e3,
      viewValue: '500,000'
    },
    {
      value: 1e6,
      viewValue: '1 million'
    },
    {
      value: -1,
      viewValue: 'All'
    }
  ];

  numericStatsReservoirSize = [
    {
      value: 100e3,
      viewValue: '100,000'
    },
    {
      value: 500e3,
      viewValue: '500,000'
    },
    {
      value: 1e6,
      viewValue: '1 million'
    }
  ];
}
