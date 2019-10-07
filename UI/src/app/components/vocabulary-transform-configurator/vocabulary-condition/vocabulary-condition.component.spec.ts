import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyConditionComponent } from './vocabulary-condition.component';

describe('VocabularyConditionComponent', () => {
  let component: VocabularyConditionComponent;
  let fixture: ComponentFixture<VocabularyConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
