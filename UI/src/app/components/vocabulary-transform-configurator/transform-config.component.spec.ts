import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformConfigComponent } from './transform-config.component';

describe('TransformConfigComponent', () => {
  let component: TransformConfigComponent;
  let fixture: ComponentFixture<TransformConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
