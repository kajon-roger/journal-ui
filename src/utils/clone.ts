export function clone<T>(toClone: T): T {
    return JSON.parse(JSON.stringify(toClone));
}
