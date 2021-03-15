import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyDropdownComponent } from './vocabulary-dropdown.component';

describe('VocabularyDropdownComponent', () => {
  let component: VocabularyDropdownComponent;
  let fixture: ComponentFixture<VocabularyDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
