export function deepCopy<T>(object: T): T {
  if (Array.isArray(object)) {
    // @ts-expect-error: Unsafe type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return object.map((item) => deepCopy(item));
  }

  if (object instanceof Date) {
    // @ts-expect-error: Unsafe type
    return new Date(object.getTime());
  }

  if (object && typeof object === 'object') {
    const getters = Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(object)))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function' && key !== '__proto__')
      .map(([key]) => key);

    const copy: Record<string, unknown> = {};
    for (const key of [...Object.keys(object), ...getters]) {
      // @ts-expect-error: Unsafe type
      copy[key] = deepCopy(object[key]);
    }

    // @ts-expect-error: Unsafe type
    return copy;
  }

  return object;
}

export function generate2dFields<T>(rows: number, columns: number, fillValue: T): T[][] {
  return Array.from<T[]>({ length: rows })
    .fill([fillValue])
    .map(() => Array.from<T>({ length: columns }).fill(fillValue));
}
