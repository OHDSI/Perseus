import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { GridComponent } from '../grid.component';
import { Pagination } from '@models/grid/pagination';

@Component({
  selector: 'app-navigation-grid',
  templateUrl: './navigation-grid.component.html',
  styleUrls: [
    '../grid.component.scss',
    './navigation-grid.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationGridComponent<T> extends GridComponent<T> implements OnInit {

  gridData: T[]

  @Input()
  error: string | boolean

  @Input()
  pageSize = 10

  @Input()
  total = 0

  @Output()
  pagination = new EventEmitter<Pagination>()

  movableIndexes = {
    second: 2,
    third: 3,
  }

  pageCount = 1

  currentPage = 1

  private pageNumberRecognizer = {
    first: () => 1,
    second: () => this.movableIndexes.second,
    third: () => this.movableIndexes.third,
    fourth: () => this.pageCount
  };

  showByValues = [
    {
      value: 15,
      viewValue: '15'
    },
    {
      value: 30,
      viewValue: '30'
    },
    {
      value: 50,
      viewValue: '50'
    },
    {
      value: 100,
      viewValue: '100'
    },
    {
      value: 500,
      viewValue: '500'
    }
  ];

  constructor(public cdr: ChangeDetectorRef) {
    super();
  }

  @Input()
  set data(data: T[]) {
    this.gridData = data
  }

  ngOnInit(): void {
    super.ngOnInit()
  }

  handleNavigation(event: MouseEvent) {
    if (this.needNavigation(event)) {
      this.pagination.emit({
        pageNumber: this.currentPage,
        pageCount: this.pageCount
      })
    }
  }

  setPagesAndElementsCount(total: number, pageCount: number) {
    if (this.total !== total || this.pageCount !== pageCount) {
      if (this.currentPage >= pageCount) { // current page > new page count
        this.currentPage = pageCount;
        this.setMovableIndexes(pageCount - 2, pageCount);
      } else if (this.currentPage === this.pageCount) { // current page = old page count
        this.setMovableIndexes(this.currentPage - 1, pageCount);
      }

      if (this.currentPage === 0) {
        this.currentPage = 1;
      }

      this.total = total;
      this.pageCount = pageCount;
    }
  }

  protected needNavigation(event: MouseEvent): boolean {
    const dataset = (event.target as HTMLElement).dataset;

    if (dataset.arrow) {
      return this.handleArrowNavigation(dataset.arrow);
    } else {
      const getPage = this.pageNumberRecognizer[dataset.page];
      const page = getPage ? getPage() : null;

      if (page && page !== this.currentPage) {
        return this.handlePageNavigation(page);
      }
    }
  }

  private handleArrowNavigation(arrow: string): boolean {
    if (arrow === 'left' && this.currentPage !== 1) {
      if (this.currentPage === this.movableIndexes.second && this.movableIndexes.second !== 2) {
        this.setMovableIndexes(this.movableIndexes.second - 1);
      }
      this.currentPage--;

      return true;
    } else if (arrow === 'right' && this.currentPage !== this.pageCount) {
      if (this.currentPage === this.movableIndexes.third && this.movableIndexes.third !== this.pageCount - 1) {
        this.setMovableIndexes(this.movableIndexes.second + 1);
      }
      this.currentPage++;

      return true;
    }

    return false;
  }

  private handlePageNavigation(page: number): boolean {
    if (page !== this.currentPage) {
      this.currentPage = page;
      if (page === 1 && this.movableIndexes.second !== 2) {
        this.setMovableIndexes(2);
      } else if (page === this.pageCount && this.movableIndexes.third !== this.pageCount - 1) {
        this.setMovableIndexes(this.pageCount - 2);
      }
      return true;
    }

    return false;
  }

  private setMovableIndexes(second: number, pageCount = this.pageCount) {
    if (pageCount < 4 || second < 2) {
      this.movableIndexes = {
        second: 2,
        third: 3
      };
    } else {
      this.movableIndexes = {
        second,
        third: second + 1
      };
    }
  }
}
