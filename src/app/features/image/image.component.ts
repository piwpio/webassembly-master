import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Img } from '@features/image/image.model';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  isReady = false;
  isRunning = false;

  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;

  private grayscaleWasm: Img;
  private invertWasm: Img;
  private sephiaWasm: Img;
  private wasmMemory: any;

  constructor(private readonly webassemblyService: WebassemblyService) {}

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.webassemblyService.initWasm('/assets/scripts/image/image.wasm').then((results) => {
      this.wasmMemory = results.instance.exports.memory;

      this.grayscaleWasm = results.instance.exports._Z9grayscalePhi as Img;
      this.invertWasm = results.instance.exports._Z6invertPhi as Img;
      this.sephiaWasm = results.instance.exports._Z6sephiaPhi as Img;

      this.prepareImage();
    });
  }

  test(method, isWasm = false): void {
    this.prepareCanvas();
    const imageData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    let startTime2;
    let endTime2;
    let diff2 = 0;

    const startTime = performance.now();

    let array;
    if (isWasm) {
      startTime2 = performance.now();
      array = new Uint8ClampedArray(this.wasmMemory.buffer, 0, imageData.data.length);
      array.set(imageData.data);
      endTime2 = performance.now();
      diff2 = endTime2 - startTime2;
    } else {
      array = imageData.data;
      // array = new Uint8ClampedArray(imageData.data);
    }
    method(!isWasm ? array : 0, array.length);
    imageData.data.set(array);
    this.ctx.putImageData(imageData, 0, 0);

    const endTime = performance.now();
    let diff = endTime - startTime - diff2;
    if (diff === 0) diff = 0.000000000001;

    console.log(diff);
  }

  private prepareImage(): void {
    const image = new Image();
    image.onload = () => {
      this.image = image;
      image.style.display = 'none';
      this.isReady = true;

      // for (let i = 0; i < 10; i++) {
      //   this.test(this.grayscaleJs);
      // }
      // for (let i = 0; i < 10; i++) {
      //   this.test(this.grayscaleWasm, true);
      // }
      // for (let i = 0; i < 10; i++) {
      //   this.test(this.invertJs);
      // }
      // for (let i = 0; i < 10; i++) {
      //   this.test(this.invertWasm, true);
      // }
      for (let i = 0; i < 10; i++) {
        this.test(this.sephiaJS);
      }
      for (let i = 0; i < 10; i++) {
        this.test(this.sephiaWasm, true);
      }
    };
    image.src = '/assets/images/niceView.jpeg';
  }

  private invertJs(data: Uint8ClampedArray, size: number): void {
    for (let i = 0; i < size; i += 4) {
      data[i] = 255 - data[i]; // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
  }

  private grayscaleJs(data: Uint8ClampedArray, size: number): void {
    for (let i = 0; i < size; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
  }

  private sephiaJS(data: Uint8ClampedArray, size: number): void {
    for (let i = 0; i < size; i += 4) {
      const outRed = data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189;
      const outGreen = data[i] * 0.349 + data[i + 1] * 0.686 + data[i + 2] * 0.168;
      const outBlue = data[i] * 0.272 + data[i + 1] * 0.534 + data[i + 2] * 0.131;
      data[i] = outRed < 255 ? outRed : 255;
      data[i + 1] = outGreen < 255 ? outGreen : 255;
      data[i + 2] = outBlue < 255 ? outBlue : 255;
    }
  }

  private prepareCanvas(): void {
    this.ctx.canvas.width = this.image.width;
    this.ctx.canvas.height = this.image.height;
    this.ctx.drawImage(this.image, 0, 0);
  }
}
