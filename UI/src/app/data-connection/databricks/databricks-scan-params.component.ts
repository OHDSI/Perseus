import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @Input() maxWidth?: number = 430;

  scanParamsForm: FormGroup;
  deployNotebookJob = new FormControl(true);
  @ViewChild('notebookPath', {read: ElementRef}) notebookPath: ElementRef;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.scanParamsForm = this.formBuilder.group({
      runAsJob: new FormControl(false),
      deployNotebookJob: this.deployNotebookJob,
      notebookPath: {}
    });
    this.scanParamsForm.get('notebookPath').value
  }

  focusOnNotebookPath()  {
    setTimeout(() => {this.notebookPath.nativeElement.focus()})
  }

  setFormStyle() {
    const s = {}
    if (true) {
      s['max-width'] = `${this.maxWidth}px`
    }
    console.log(s)
    return s
  }

}
