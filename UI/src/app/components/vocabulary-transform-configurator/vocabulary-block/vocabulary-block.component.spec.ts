import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyBlockComponent } from './vocabulary-block.component';

describe('VocabularyConfigurationComponent', () => {
  let component: VocabularyBlockComponent;
  let fixture: ComponentFixture<VocabularyBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
