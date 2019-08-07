import { Component, OnInit } from '@angular/core';

import { StateService } from 'src/app/services/state.service';
import { DataService } from 'src/app/services/data.service';
import { CommonService } from 'src/app/services/common.service';
import { BridgeService } from 'src/app/services/bridge.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {
  busy = true;

  constructor(
    private stateService: StateService,
    private dataService: DataService,
    private commonService: CommonService,
    private bridgeService: BridgeService
  ) {}

  ngOnInit() {
    this.dataService.initialize().subscribe(_ => {
      this.busy = false;
    });
  }

  get hint() {
    return this.commonService.hintStatus;
  }

  get state() {
    return this.stateService.state;
  }

  trackByFn(index) {
    return index;
  }

  generateMappingJson() {
    const mappingJSON = this.bridgeService.generateMapping();
    this.dataService.getXml(mappingJSON).subscribe(result => {
      console.log(result);
    });
  }
}
