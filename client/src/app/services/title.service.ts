import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketMessageTestType } from '@models/server-data.model';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  public test$: BehaviorSubject<SocketMessageTestType> = new BehaviorSubject<SocketMessageTestType>(null);
}
