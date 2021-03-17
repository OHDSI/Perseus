import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenMappingDialogComponent } from './open-mapping-dialog.component';

describe('SaveMappingDialogComponent', () => {
  let component: OpenMappingDialogComponent;
  let fixture: ComponentFixture<OpenMappingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenMappingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
