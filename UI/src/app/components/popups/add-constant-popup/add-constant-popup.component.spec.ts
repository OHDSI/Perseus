import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConstantPopupComponent } from './add-constant-popup.component';

describe('AddConstantPopupComponent', () => {
  let component: AddConstantPopupComponent;
  let fixture: ComponentFixture<AddConstantPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConstantPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConstantPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
