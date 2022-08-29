export type Fib = (fib: number) => number;

export type FibResult = DOMHighResTimeStamp;

export interface FibTests {
  js?: Fib;
  wasm?: Fib;
}

export interface FibResults {
  js: FibResult[];
  wasm: FibResult[];
}
