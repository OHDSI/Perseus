import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-links-warning',
  templateUrl: './delete-links-warning.component.html',
  styleUrls: ['./delete-links-warning.component.scss', '../cdm-version-dialog/cdm-version-dialog.component.scss']
})
export class DeleteLinksWarningComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
