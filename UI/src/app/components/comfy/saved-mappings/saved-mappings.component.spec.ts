import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedMappingsComponent } from './saved-mappings.component';

describe('SavedMappingsComponent', () => {
  let component: SavedMappingsComponent;
  let fixture: ComponentFixture<SavedMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
