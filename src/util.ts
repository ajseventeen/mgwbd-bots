export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

export function chooseRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}
