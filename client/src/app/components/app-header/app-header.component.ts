import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SocketMessageEvent } from '@models/server-data.model';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnDestroy {
  @Output() menuClick: EventEmitter<any> = new EventEmitter<any>();

  title = 'Performance comparison of WebAssembly and JavaScript';
  private $destroy: Subject<boolean> = new Subject();

  constructor(private readonly titleService: TitleService) {
    this.titleService.test$.pipe(takeUntil(this.$destroy), distinctUntilChanged()).subscribe((test) => {
      this.setTitle(test);
    });
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }

  private setTitle(param: SocketMessageEvent): void {
    if (param === 'matrix-det') {
      this.title = 'Matrix determinant';
    } else if (param === 'cholesky') {
      this.title = 'Cholesky decomposition';
    } else if (param === 'matrix-mul') {
      this.title = 'Matrix multiplication';
    } else if (param === 'quicksort') {
      this.title = 'Quicksort';
    } else if (param === 'fibonacci') {
      this.title = 'Fibonacci';
    } else {
      this.title = 'Performance comparison of WebAssembly and JavaScript';
    }
  }
}
