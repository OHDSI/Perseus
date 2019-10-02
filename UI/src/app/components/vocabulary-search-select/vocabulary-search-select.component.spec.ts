import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularySearchSelectComponent } from './vocabulary-search-select.component';

describe('VocabularySearchSelectComponent', () => {
  let component: VocabularySearchSelectComponent;
  let fixture: ComponentFixture<VocabularySearchSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularySearchSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularySearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
