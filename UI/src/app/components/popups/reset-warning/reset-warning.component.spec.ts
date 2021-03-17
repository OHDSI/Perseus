import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetWarningComponent } from './reset-warning.component';

describe('ResetWarningComponent', () => {
  let component: ResetWarningComponent;
  let fixture: ComponentFixture<ResetWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
