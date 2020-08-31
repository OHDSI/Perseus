import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlTransformationComponent } from './sql-transformation.component';

describe('SqlTransformationComponent', () => {
  let component: SqlTransformationComponent;
  let fixture: ComponentFixture<SqlTransformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlTransformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlTransformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
