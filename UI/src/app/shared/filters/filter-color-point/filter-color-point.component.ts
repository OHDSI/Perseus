import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-color-point',
  templateUrl: './filter-color-point.component.html',
  styleUrls: ['./filter-color-point.component.scss']
})
export class FilterColorPointComponent {

  @Input()
  color: string
}
