import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationTypeComponent } from './transformation-type.component';

describe('TransformationTypeComponent', () => {
  let component: TransformationTypeComponent;
  let fixture: ComponentFixture<TransformationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
