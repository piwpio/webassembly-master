import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from '@services/socket.service';
import { BaseServerTestComponent } from '@components/base-server-test/base-server-test.component';
import { ServerReadyService } from '@services/server-ready.service';
import { SocketMessageTestData, SocketMessageTestType } from '@models/server-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'server-sort',
  templateUrl: './server-sort.component.html',
  styleUrls: ['./server-sort.component.scss'],
})
export class ServerSortComponent extends BaseServerTestComponent {
  testType: SocketMessageTestType = 'sort';
  testData: SocketMessageTestData = {
    testType: this.testType,
    repeatTimes: 1,
    clientData: [],
    custom: {
      arrayLength: 10,
      floatDataType: true,
    },
  };

  constructor(
    protected socketService: SocketService,
    protected serverReadyService: ServerReadyService,
    protected readonly chRef: ChangeDetectorRef,
    private readonly matSnackBar: MatSnackBar
  ) {
    super(socketService, serverReadyService, chRef);
  }

  getTestData(): SocketMessageTestData {
    if (!this.areInputsValid()) {
      this.matSnackBar.open('Invalid inputs');
      return null;
    }

    this.testData.clientData = this.generateFeed(this.testData.custom.arrayLength, this.testData.custom.floatDataType);
    return this.testData;
  }

  visualize(data): void {
    // console.log(data);
  }

  private areInputsValid(): boolean {
    const repeatTimes = this.testData.repeatTimes;
    const arrayLength = this.testData.custom.arrayLength;
    const floatDataType = this.testData.custom.floatDataType;
    return (
      typeof floatDataType === 'boolean' &&
      repeatTimes >= 1 &&
      repeatTimes <= 10 &&
      arrayLength > 1 &&
      arrayLength <= 10_000_000
    );
  }

  private generateFeed(arraySize: number, floats = true, max = 200_000_000): number[] {
    const feed = [];
    if (floats) {
      for (let i = 0; i < arraySize; i++) {
        feed.push(Math.random());
      }
    } else {
      for (let i = 0; i < arraySize; i++) {
        feed.push(Math.floor(Math.random() * max));
      }
    }
    return feed;
  }
}
