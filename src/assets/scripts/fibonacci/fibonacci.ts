export const fibonacciRecursive = (n: number): number => {
  if (n === 0 || n === 1) return n;
  else return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
};

export const fibonacciLoop = (n: number) => {
  let a = 1;
  let b = 0;
  let tmp;

  while (n >= 0) {
    tmp = a;
    a = a + b;
    b = tmp;
    n--;
  }

  return b;
};
