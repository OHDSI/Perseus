import { MatDialogRef } from '@angular/material/dialog'
import { Conversion } from '@models/conversion/conversion'
import { ConversionStatus } from '@models/conversion/conversion-status'
import { ConversionDialogStatus } from '@scan-data/conversion-dialog-status'

export abstract class ConversionDialog {
  conversion: Conversion | null = null;
  private selectedIndex: number = ConversionDialogStatus.SET_PARAMETERS;

  protected constructor(protected dialogRef: MatDialogRef<ConversionDialog>) {
  }

  set index(value: number) {
    this.selectedIndex = value;
    this.changeSize();
  }

  get index() {
    return this.selectedIndex;
  }

  get isSetParametersMode(): boolean {
    return this.selectedIndex === ConversionDialogStatus.SET_PARAMETERS
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCloseByDagger() {
    if (this.selectedIndex === ConversionDialogStatus.SET_PARAMETERS ||
      this.conversion?.statusCode !== ConversionStatus.IN_PROGRESS) {
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.index = ConversionDialogStatus.SET_PARAMETERS;
  }

  protected changeSize() {
    if (this.index === 0) {
      this.dialogRef.updateSize('700px', '735px');
    } else {
      this.dialogRef.updateSize('613px', '478px');
    }
  }
}
