import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { Message, SocketMessageEvent, SocketMessageTestData, SocketMessageTestType } from '@models/server-data.model';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private disconnected: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private connected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private socket: Socket) {
    this.socket.ioSocket.on('connect', () => {
      this.connected.next(true);
    });
    this.socket.ioSocket.on('disconnect', () => {
      this.disconnected.next(true);
    });
    // this.startDebugListening();
  }

  onDisconnect(): Observable<any> {
    return this.disconnected.asObservable();
  }

  onConnect(): Observable<any> {
    return this.connected.asObservable();
  }

  startListeningOn<T>(event: SocketMessageEvent): Observable<T> {
    return this.socket.fromEvent<Message<T>>('msg').pipe(
      tap((a) => {
        console.log(a);
      }),
      filter((msg) => msg.event === event),
      map((msg: Message<T>) => msg.data)
    );
  }

  startDebugListening(): void {
    this.socket.fromEvent('msg').subscribe((data) => {
      const str = JSON.stringify(data, null, 2);
      console.log('#########################################################');
      // console.log(new Date());
      console.log(str);
    });
  }

  private emit(event: SocketMessageEvent, data?: any): void {
    const socketMsg = {
      event,
    };
    if (data) {
      socketMsg['data'] = data;
    }
    this.socket.emit('msg', socketMsg);
  }

  emitGetStatus(): void {
    this.emit('status');
  }

  emitNewTest(messageData: SocketMessageTestData): void {
    this.emit('newTest', messageData);
  }
}
