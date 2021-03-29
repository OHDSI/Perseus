import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-codes',
  templateUrl: './import-codes.component.html',
  styleUrls: ['./import-codes.component.scss']
})
export class ImportCodesComponent implements OnInit {

  imported = false

  constructor() { }

  ngOnInit(): void {
  }

  onImport() {
    this.imported = true
  }
}
