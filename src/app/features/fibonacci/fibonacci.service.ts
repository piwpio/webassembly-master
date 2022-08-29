import { Injectable } from '@angular/core';
import { FibonacciModule } from '@features/fibonacci/fibonacci.module';

@Injectable({
  providedIn: FibonacciModule,
})
export class FibonacciService {
  constructor() {}
}
