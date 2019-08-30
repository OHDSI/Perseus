import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsListComponent } from './columns-list.component';

describe('ColumnsListComponent', () => {
  let component: ColumnsListComponent;
  let fixture: ComponentFixture<ColumnsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
