export function sortObject<T extends Record<string, unknown>>(obj: T, sortFunction: (a: string, b: string) => number): T {
  return Object.keys(obj).sort(sortFunction).reduce((result: Record<string, unknown>, key) => {
    result[key] = obj[key];
    return result;
  }, {}) as T;
}