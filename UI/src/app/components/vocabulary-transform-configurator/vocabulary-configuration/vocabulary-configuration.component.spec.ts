import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyConfigurationComponent } from './vocabulary-configuration.component';

describe('VocabularyConfigurationComponent', () => {
  let component: VocabularyConfigurationComponent;
  let fixture: ComponentFixture<VocabularyConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
