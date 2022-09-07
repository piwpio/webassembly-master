
#include <emscripten.h>
#include <stdint.h>
#include <inttypes.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
void grayscale(uint8_t data[], int size)
{
    for (int i = 0; i < size; i += 4) {
        uint8_t avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
}

EMSCRIPTEN_KEEPALIVE
void invert(uint8_t data[], int size)
{
    for (int i = 0; i < size; i += 4) {
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
}

EMSCRIPTEN_KEEPALIVE
void sephia(uint8_t data[], int size)
{
    for(int i = 0; i < size; i += 4) {
        short int outRed = (data[i] * .393) + (data[i + 1] * .769) + (data[i + 2] * .189);
        short int outGreen = (data[i] * .349) + (data[i + 1] * .686) + (data[i + 2] * .168);
        short int outBlue = (data[i] * .272) + (data[i + 1] * .534) + (data[i + 2] * .131);
        data[i] = outRed < 255 ? outRed : 255;
        data[i + 1] = outGreen < 255 ? outGreen : 255;
        data[i + 2] = outBlue < 255 ? outBlue : 255;
    }
}

}
