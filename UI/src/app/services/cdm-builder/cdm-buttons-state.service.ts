import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CdmButtonsStateService {
  testSourceConnection = false
  testTargetConnection = false
  converting = false
  generatingFakeData = false
  dqdRunning = false
}
