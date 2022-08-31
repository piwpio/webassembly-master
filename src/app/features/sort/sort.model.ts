export type Sort = (data: number[], start: number, end: number) => void;

export type SortResult = DOMHighResTimeStamp;

export interface ImgTest {
  js: SortResult[];
  wasm: SortResult[];
}
