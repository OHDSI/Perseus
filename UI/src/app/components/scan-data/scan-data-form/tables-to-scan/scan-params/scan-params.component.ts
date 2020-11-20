import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scan-params',
  templateUrl: './scan-params.component.html',
  styleUrls: ['./scan-params.component.scss', '../../../scan-data-check.scss']
})
export class ScanParamsComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }

}
