import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyTransformConfiguratorComponent } from './vocabulary-transform-configurator.component';

describe('VocabularyTransformConfiguratorComponent', () => {
  let component: VocabularyTransformConfiguratorComponent;
  let fixture: ComponentFixture<VocabularyTransformConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyTransformConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyTransformConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
