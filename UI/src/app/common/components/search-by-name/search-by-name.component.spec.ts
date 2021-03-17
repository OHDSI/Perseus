import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByNameComponent } from './search-by-name.component';

describe('SearchByNameComponent', () => {
  let component: SearchByNameComponent;
  let fixture: ComponentFixture<SearchByNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchByNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
