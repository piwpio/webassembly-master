export type SocketMessageEvent =
  | 'status'
  | 'newTest'
  | 'matrix-det'
  | 'matrix-mul'
  | 'cholesky'
  | 'quicksort'
  | 'fibonacci';
export type SocketMessageTestType = 'matrix-det' | 'matrix-mul' | 'cholesky' | 'quicksort' | 'fibonacci';

export interface Message<T> {
  event: SocketMessageEvent;
  data: T;
}

export interface SocketMessageStatus {
  isReady: boolean;
  testType?: SocketMessageTestType;
  testResults?: {
    visualization: any;
    results: TestResults[];
  };
}

export interface TestResults {
  memory: number[];
  performance: number[];
  testIndex: number;
  testLabel: string;
}

export interface SocketMessageTestData {
  testType: SocketMessageTestType;
  repeatTimes: number;
  approach: 'single' | 'thread' | 'cluster';
  clientData: any;
  custom?: {
    [key: string]: any;
  };
}
