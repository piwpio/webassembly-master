import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SocketService } from '@services/socket.service';
import { SocketMessageStatus, SocketMessageTestData, SocketMessageTestType } from '@models/server-data.model';
import { ServerReadyService } from '@services/server-ready.service';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-base-server-test',
})
export abstract class BaseServerTestComponent implements OnInit, OnDestroy {
  testType: SocketMessageTestType;
  isReadyForNextTest = false;

  private $destroy: Subject<boolean> = new Subject<boolean>();

  protected constructor(
    protected readonly socketService: SocketService,
    protected readonly serverReadyService: ServerReadyService,
    protected readonly chRef: ChangeDetectorRef
  ) {
    // Allow to perform tests if possible
    this.serverReadyService
      .onReady()
      .pipe(takeUntil(this.$destroy))
      .subscribe((isReady) => {
        this.setIsReadyForNextTest(isReady);
      });

    // Check once if component test type is ready and show results if yes.
    this.socketService
      .startListeningOn<SocketMessageStatus>('status')
      .pipe(
        take(1),
        filter((status) => !!status?.testType),
        filter((status) => status.testType === this.testType)
      )
      .subscribe((payload) => {
        console.log(payload);
      });
  }

  ngOnInit(): void {
    this.socketService.emitGetStatus();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  abstract getTestData(): SocketMessageTestData;

  runTest(): void {
    const testData = this.getTestData();
    // console.log(testData);
    this.socketService.emitNewTest(testData);
  }

  private setIsReadyForNextTest(isReady: boolean): void {
    this.isReadyForNextTest = isReady;
    this.chRef.markForCheck();
  }
}
