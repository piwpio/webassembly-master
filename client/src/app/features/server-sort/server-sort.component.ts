import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from '@services/socket.service';
import { BaseServerTestComponent } from '@components/base-server-test/base-server-test.component';
import { ServerReadyService } from '@services/server-ready.service';
import { SocketMessageTestData, SocketMessageTestType } from '@models/server-data.model';

@Component({
  selector: 'server-sort',
  // templateUrl: '../../components/base-server-test/base-server-test.component.html',
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
      arrayLength: 100000,
      floatDataType: true,
    },
  };

  constructor(
    protected socketService: SocketService,
    protected serverReadyService: ServerReadyService,
    protected readonly chRef: ChangeDetectorRef
  ) {
    super(socketService, serverReadyService, chRef);
  }

  getTestData(): SocketMessageTestData {
    this.testData.clientData = this.generateFeed(this.testData.custom.arrayLength, this.testData.custom.floatDataType);
    return this.testData;
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
