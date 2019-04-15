import { Component, OnInit } from '@angular/core';

import { StateService } from 'src/app/services/state.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.dataService.initialize();
  }

  get hint() {
    return this.commonService.hintStatus;
  }

  get state() {
    return this.stateService.state;
  }
}
