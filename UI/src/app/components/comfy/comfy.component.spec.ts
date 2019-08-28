import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfyComponent } from './comfy.component';

describe('ComfyComponent', () => {
  let component: ComfyComponent;
  let fixture: ComponentFixture<ComfyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComfyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
