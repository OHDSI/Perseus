import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSaveDialogComponent } from './open-save-dialog.component';

describe('OpenSaveDialogComponent', () => {
  let component: OpenSaveDialogComponent;
  let fixture: ComponentFixture<OpenSaveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenSaveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
