import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfySearchByNameComponent } from './comfy-search-by-name.component';

describe('ComfySearchByNameComponent', () => {
  let component: ComfySearchByNameComponent;
  let fixture: ComponentFixture<ComfySearchByNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfySearchByNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfySearchByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
