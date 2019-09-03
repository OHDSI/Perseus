import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-saved-mappings',
  templateUrl: './saved-mappings.component.html',
  styleUrls: ['./saved-mappings.component.scss']
})
export class SavedMappingsComponent implements OnInit {
  formControl = new FormControl();
  configurations = [{name: 'Max'}, {name: 'Denis'}];

  constructor() { }

  ngOnInit() {
  }

  openedChangeHandler(event: any) {

  }

  onOpenConfiguration(event: any, configuration: any) {

  }
}
