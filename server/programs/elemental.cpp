#include <emscripten.h>
#include <iostream>

extern "C" {


EMSCRIPTEN_KEEPALIVE
void elemental(int n, double *array)
{
    for (int i = 0; i < n; i++) {
        array[i] = sqrt(array[i]);
    }
}

}
