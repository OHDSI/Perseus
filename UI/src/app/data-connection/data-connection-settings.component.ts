import { Observable } from "rxjs"
import { NewScanRequest } from "./api/models"

export interface DataConnectionSettingsComponent {

  // Re-initialize all inputs/settings.
  reset(): void

  // For backward compatability.
  // Notify app whenever input changes.
  get valueChanges(): Observable<any>

  // Validates user input for a table scan (no profile).
  get valid(): boolean

  // Stop/restart user input
  disable(): void
  enable(): void

  // Returns a value based on user input
  // to be used as input to "TestConnection".
  submit(): any
}
export interface LoopbackDataConnectionSettingsComponent extends DataConnectionSettingsComponent {
  submit(): NewScanRequest['dataSourceConfig']
}