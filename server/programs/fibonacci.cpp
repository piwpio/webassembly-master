#include <emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
unsigned long long int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// EMSCRIPTEN_KEEPALIVE
// unsigned long long int fibonacciWhile(int n) {
//     unsigned long long int a = 1;
//     unsigned long long int b = 0;
//     unsigned long long int tmp;
//
//   while (n > 0) {
//     tmp = a;
//     a = a + b;
//     b = tmp;
//     n--;
//   }
//
//   return b;
// };

}
