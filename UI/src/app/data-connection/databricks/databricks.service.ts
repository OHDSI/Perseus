import { Injectable } from '@angular/core';
import { ScanRequest, ScanRequestLog } from '../api/models';

@Injectable()
export class DatabricksService {

  scanLogs: {[key: number]: {
    scanRequest: ScanRequest,
    logs: ScanRequestLog[]}
  } = {}

  lastModelDefRequest: ScanRequest
  lastProfileRequest: ScanRequest
  currentProfileRequest: ScanRequest

  get logsForLastModelDefRequest() {
    return this.scanLogs[this.lastModelDefRequest.id].logs
  }

  get logsForLastProfileRequest() {
    return this.scanLogs[this.lastProfileRequest.id].logs
  }

  get validProfileRequest(): boolean {
    return Boolean(this.currentProfileRequest?.scanParameters?.modelDefinitions?.length > 0)
  }

}