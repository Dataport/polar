/**
 * Copied from https://stackoverflow.com/a/54178819.
 *
 * Makes the properties defined by type `K` optional in type `T`.
 *
 * @example `PartialBy<LayerConfiguration, 'id' | 'name'>`
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
