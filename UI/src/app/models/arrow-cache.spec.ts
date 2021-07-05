import { IArrowCache } from '@models/arrow-cache';
import { MockComponent, MockConnection } from '@app/test/mock';
import { Renderer2, Type } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { classToPlain } from 'class-transformer';
import { deletedArrowFields, deletedRowFields } from '@test/test.consts';

describe('ArrowCache', () => {

  let renderer: Renderer2

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2]
    }).compileComponents();
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(MockComponent)
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should remove unnecessary fields for prepare to save in a file', () => {
    const cache: IArrowCache = {'test-key': new MockConnection(renderer)}
    const cachePlain = classToPlain(cache)
    const jsonString = JSON.stringify(cachePlain)
    const deletedFields = ['view', ...deletedRowFields, ...deletedArrowFields]

    expect(
      deletedFields.every(field => !jsonString.includes(field))
    ).toBeTrue()
  })
})
