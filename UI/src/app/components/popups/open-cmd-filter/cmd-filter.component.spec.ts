import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdFilterComponent } from './cmd-filter.component';

describe('OpenCmdFilterComponent', () => {
  let component: CmdFilterComponent;
  let fixture: ComponentFixture<CmdFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmdFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmdFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
