export type Fib = (fib: number) => number;

export interface FibTest {
  testLabel: string;
  method: Fib;
}

export type FibResult = DOMHighResTimeStamp;

export interface FibTests {
  js?: FibTest;
  wasm?: FibTest;
}

export interface FibResults {
  js: FibResult[];
  wasm: FibResult[];
}
