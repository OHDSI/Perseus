import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdmFilterComponent } from './cdm-filter.component';

describe('OpenCmdFilterComponent', () => {
  let component: CdmFilterComponent;
  let fixture: ComponentFixture<CdmFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdmFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdmFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
