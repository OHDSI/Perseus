import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyConfigComponent } from './vocabulary-config.component';

describe('VocabularyTransformConfiguratorComponent', () => {
  let component: VocabularyConfigComponent;
  let fixture: ComponentFixture<VocabularyConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
