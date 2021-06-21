import { Injectable, Injector } from '@angular/core';
import { StateService } from '@services/state/state.service';
import { BridgeService } from '@services/bridge.service';
import { StoreService } from '@services/store.service';
import { DrawService } from '@services/draw.service';
import { ScanDataStateService } from '@services/white-rabbit/scan-data-state.service';
import { CdmStateService } from '@services/cdm-builder/cdm-state.service';
import { FakeDataStateService } from '@services/white-rabbit/fake-data-state.service';
import { DqdConnectionSettingsStateService } from '@services/data-quality-check/dqd-connection-settings-state.service';
import { VocabularySearchStateService } from '@services/vocabulary-search/vocabulary-search-state.service';
import { ImportCodesService } from '@services/import-codes/import-codes.service';
import { ScoredConceptsCacheService } from '@services/import-codes/scored-concepts-cache.service';

@Injectable()
export class ResetStateService {

  private stateRefs: (new(...args) => StateService)[] = [
    BridgeService,
    StoreService,
    DrawService,
    ScanDataStateService,
    CdmStateService,
    FakeDataStateService,
    DqdConnectionSettingsStateService,
    VocabularySearchStateService,
    ImportCodesService,
    ScoredConceptsCacheService
  ]

  constructor(private injector: Injector) {
  }

  resetAppState() {
    this.stateRefs
      .map(ref => this.injector.get<StateService>(ref, null))
      .filter(stateService => stateService !== null)
      .forEach(stateService => stateService.reset())
  }
}
