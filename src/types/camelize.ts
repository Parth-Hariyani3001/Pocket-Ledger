type SnakeToCamel<S extends string> =
    S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamel<U>>}`
    : S

export type Camelize<T> = {
    [K in keyof T as SnakeToCamel<string & K>]: T[K]
}