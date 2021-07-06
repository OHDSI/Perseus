import { IRow, Row } from '@models/row';
import { classToPlain } from 'class-transformer';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockRow } from '@app/test/mock';
import { Renderer2, Type } from '@angular/core';
import { deletedRowFields } from '@test/test.consts';

describe('Row', () => {

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
    const row: IRow = new MockRow()
    row.htmlElement = renderer.createElement('div')
    const state = classToPlain(row)
    const deletedFields = ['view', ...deletedRowFields]
    const resultFields = Object.keys(state)

    expect(
      deletedFields.every(field => !resultFields.includes(field))
    ).toBeTrue()
  })
})
