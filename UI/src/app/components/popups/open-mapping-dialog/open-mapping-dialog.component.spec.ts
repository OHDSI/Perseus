import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveMappingDialogComponent } from './open-mapping-dialog.component';

describe('SaveMappingDialogComponent', () => {
  let component: SaveMappingDialogComponent;
  let fixture: ComponentFixture<SaveMappingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveMappingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
