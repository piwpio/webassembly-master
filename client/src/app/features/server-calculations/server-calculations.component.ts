import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketMessageTestData, SocketMessageTestType } from '@models/server-data.model';
import { SocketService } from '@services/socket.service';
import { ServerReadyService } from '@services/server-ready.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseServerTestComponent } from '@components/base-server-test/base-server-test.component';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'server-calculations',
  templateUrl: './server-calculations.component.html',
  styleUrls: ['./server-calculations.component.scss'],
})
export class ServerCalculationsComponent extends BaseServerTestComponent {
  testData: SocketMessageTestData = {
    approach: 'cluster',
    testType: this.testType,
    repeatTimes: 1,
    clientData: 10,
  };

  private lastValues = {};

  constructor(
    protected socketService: SocketService,
    protected serverReadyService: ServerReadyService,
    protected readonly chRef: ChangeDetectorRef,
    private readonly matSnackBar: MatSnackBar,
    private readonly route: ActivatedRoute
  ) {
    super(socketService, serverReadyService, chRef);

    this.route.params.pipe(take(1)).subscribe((params) => {
      this.testType = params.test;
      this.testData.testType = params.test;
      this.testData.clientData = this.lastValues?.[params.test] ?? this.getDefaultValueForTest(params.test);
    });

    this.route.params.pipe(takeUntil(this.$destroy)).subscribe((params) => {
      this.testType = params.test;
      this.testData.testType = params.test;
      this.testData.clientData = this.lastValues?.[params.test] ?? this.getDefaultValueForTest(params.test);
    });
  }

  getTestData(): SocketMessageTestData {
    this.lastValues[this.testType] = this.testData.clientData;
    if (!this.areInputsValid()) {
      this.matSnackBar.open('Invalid inputs');
      return null;
    }

    return this.testData;
  }

  visualize(data): void {
    // console.log(data);
  }

  private areInputsValid(): boolean {
    if (this.testType === 'matrix-det' || this.testType === 'matrix-mul' || this.testType === 'cholesky') {
      return (
        typeof this.testData.clientData === 'number' &&
        this.testData.clientData >= 1 &&
        this.testData.clientData <= 4000
      );
    } else if (this.testType === 'quicksort') {
      return (
        typeof this.testData.clientData === 'number' &&
        this.testData.clientData >= 1 &&
        this.testData.clientData <= 6_000_000
      );
    } else if (this.testType === 'fibonacci') {
      return (
        typeof this.testData.clientData === 'number' && this.testData.clientData >= 1 && this.testData.clientData <= 50
      );
    }

    return false;
  }

  private getDefaultValueForTest(param: SocketMessageTestType): number {
    if (param === 'matrix-det' || param === 'matrix-mul' || param === 'cholesky') {
      return 1000;
    } else if (param === 'quicksort') {
      return 100_000;
    } else if (param === 'fibonacci') {
      return 30;
    }
  }
}
