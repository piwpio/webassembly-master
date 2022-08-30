export type Img = (data: Uint8ClampedArray, size: number) => number[];

export type ImgResult = DOMHighResTimeStamp;

export interface ImgTest {
  js: ImgResult[];
  wasm: ImgResult[];
}
