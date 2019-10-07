import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptConfigComponent } from './concept-config.component';

describe('ConceptConfigComponent', () => {
  let component: ConceptConfigComponent;
  let fixture: ComponentFixture<ConceptConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
