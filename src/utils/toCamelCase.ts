/* eslint-disable @typescript-eslint/no-explicit-any */
export function toCamelCase<T>(data: any): T {
    if (Array.isArray(data)) {
        return data.map(toCamelCase) as T
    }

    if (data !== null && typeof data === 'object') {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
                toCamelCase(value),
            ])
        ) as T
    }

    return data as T
}