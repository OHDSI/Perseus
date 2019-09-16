import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationInputComponent } from './transformation-input.component';

describe('TransformationInputComponent', () => {
  let component: TransformationInputComponent;
  let fixture: ComponentFixture<TransformationInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformationInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
