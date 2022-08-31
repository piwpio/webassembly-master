export const jsFibonacciRecursive = (n: number): number => {
  if (n <= 1) {
    return n;
  }
  else return jsFibonacciRecursive(n - 1) + jsFibonacciRecursive(n - 2);
};

export const jsFibonacciWhile = (n: number): number => {
  let a = 1;
  let b = 0;
  let tmp = 0;

  while (n > 0) {
    tmp = a;
    a = a + b;
    b = tmp;
    n--;
  }

  return b;
};
