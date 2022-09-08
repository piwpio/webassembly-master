export type SocketMessageEvent = 'status' | 'newTest';
export type SocketMessageTestType = 'sort';

export interface Message<T> {
  event: SocketMessageEvent;
  data: T;
}

export interface SocketMessageStatus {
  isReady: boolean;
  testType?: SocketMessageTestType;
  testResults?: any;
}

export interface SocketMessageTestData {
  testType: SocketMessageTestType;
  repeatTimes: number;
  clientData: any;
  custom?: {
    [key: string]: any;
  };
}
