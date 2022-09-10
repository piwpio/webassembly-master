import { ChangeDetectorRef, Component } from '@angular/core';
import { SocketService } from '@services/socket.service';
import { BaseServerTestComponent } from '@components/base-server-test/base-server-test.component';
import { ServerReadyService } from '@services/server-ready.service';
import { SocketMessageTestData, SocketMessageTestType } from '@models/server-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'server-matrix-det',
  templateUrl: './server-matrix-det.component.html',
})
export class ServerMatrixDetComponent extends BaseServerTestComponent {
  testType: SocketMessageTestType = 'matrix-det';
  testData: SocketMessageTestData = {
    testType: this.testType,
    repeatTimes: 1,
    clientData: 10,
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

    return this.testData;
  }

  visualize(data): void {
    // console.log(data);
  }

  private areInputsValid(): boolean {
    return (
      typeof this.testData.clientData === 'number' && this.testData.clientData >= 1 && this.testData.clientData <= 4000
    );
  }
}
