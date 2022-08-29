export const isFastestTime = (result: number, allResults: number[]): boolean => allResults.every((r) => result <= r);

export const isSlowestTime = (result: number, allResults: number[]): boolean => allResults.every((r) => result >= r);

export const getFastest = (results: number[]): number => results.sort((a, b) => b - a)?.[0] ?? undefined;

export const getSlowest = (results: number[]): number => results.sort((a, b) => a - b)?.[0] ?? undefined;
