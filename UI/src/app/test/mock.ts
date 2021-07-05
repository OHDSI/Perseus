import { Component, ElementRef, NgModule, Renderer2 } from '@angular/core';
import { IRow, Row } from '@models/row';
import { Comment } from '@models/comment';
import { Arrow } from '@models/arrow';
import { IConnector } from '@models/connector';
import { IConnection } from '@models/connection';

@Component({
  template: ''
})
export class MockComponent {}

@NgModule({
  declarations: [MockComponent]
})
export class MockModule {}

export class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

export class MockRow extends Row {
  constructor() {
    super({
      comments: [new Comment('test comment')]
    })
  }
}

export class MockArrow extends Arrow {
  constructor(renderer: Renderer2) {
    super(
      new MockElementRef(),
      'test_id',
      new MockRow(),
      new MockRow(),
      'L',
      renderer
    );
  }
}

export class MockConnection implements IConnection {
  source: IRow;
  target: IRow;
  connector: IConnector;
  transforms = []
  lookup =  {};
  type = null;
  sql = {};

  constructor(renderer: Renderer2) {
    this.source = new MockRow()
    this.target = new MockRow()
    this.connector = new MockArrow(renderer)
  }
}
