#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int fibonacci(int num) {
    if (num <= 1) {
        return 1;
    }
    
    return fibonacci(num - 1) + fibonacci(num - 2);
}
