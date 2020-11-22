import camelCaseKeys from 'camelcase-keys';
import { capitalize, isObject, chain } from 'lodash';

export default function camelCaseFlatten(input: Record<string, unknown>): Record<string, unknown> {
  function flat(res: Record<string, unknown>, key: string, val: string, pre = ''): Record<string, unknown> {
    const prefix = [pre, capitalize(key)].filter(v => v).join('');
    return isObject(val)
      ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
      : Object.assign(res, { [prefix]: val });
  }

  // @ts-ignore
  return camelCaseKeys(Object.keys(input).reduce((prev, curr) => flat(prev, curr, input[curr]), {}));
}