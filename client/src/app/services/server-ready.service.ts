import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from '@services/socket.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { SocketMessageStatus } from '@models/server-data.model';

@Injectable({
  providedIn: 'root',
})
export class ServerReadyService {
  private isReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private socketMessageStatusIsReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private cosketConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly socketService: SocketService) {
    socketService.onConnect().subscribe(() => {
      this.cosketConnected$.next(true);
      this.setServerStatus();
    });
    socketService.onDisconnect().subscribe(() => {
      this.cosketConnected$.next(false);
      this.setServerStatus();
    });
    socketService.startListeningOn<SocketMessageStatus>('status').subscribe((data) => {
      this.socketMessageStatusIsReady$.next(data.isReady);
      this.setServerStatus();
    });
  }

  onReady(): Observable<boolean> {
    return this.isReady$.asObservable().pipe(distinctUntilChanged());
  }

  private setServerStatus() {
    this.isReady$.next(this.cosketConnected$.value && this.socketMessageStatusIsReady$.value);
  }
}
