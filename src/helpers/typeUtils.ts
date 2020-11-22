export function enumToObject<T extends Record<string, unknown>, V>(enumObject: T, value: V) {
  const obj: Partial<Record<keyof T, V>> = {};

  Object.keys(enumObject).forEach((key) => {
    obj[key as keyof T] = value;
  });

  return obj as Record<keyof T, V>;
}

export function allEnumValues<T>(enumObject: Record<string, T>): T[] {
  return Object
    .keys(enumObject)
    .map(key => enumObject[key]);
}

export function isInEnum<T>(enumObject: Record<string, T>, value: T): boolean {
  return Object.values(enumObject).includes(value);
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};