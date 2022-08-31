export const jsInvert= (data: Uint8ClampedArray, size: number): void => {
  for (let i = 0; i < size; i += 4) {
    data[i] = 255 - data[i]; // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }
}

export const jsGrayscale= (data: Uint8ClampedArray, size: number): void => {
  for (let i = 0; i < size; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
}

export const jsSephia = (data: Uint8ClampedArray, size: number): void => {
  for (let i = 0; i < size; i += 4) {
    const outRed = data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189;
    const outGreen = data[i] * 0.349 + data[i + 1] * 0.686 + data[i + 2] * 0.168;
    const outBlue = data[i] * 0.272 + data[i + 1] * 0.534 + data[i + 2] * 0.131;
    data[i] = outRed < 255 ? outRed : 255;
    data[i + 1] = outGreen < 255 ? outGreen : 255;
    data[i + 2] = outBlue < 255 ? outBlue : 255;
  }
}
