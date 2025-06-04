export const badPathSymbol = Symbol('Path could not be resolved.')

/**
 * Utility function (idx) for traversing the given path of the given object
 * to retrieve data.
 * Inspired by https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a.
 *
 * @param object - The object to traverse.
 * @param path - The path of keys / indices to traverse through the object.
 * @returns The value(s) to be retrieved from the given object.
 */
export default (object: object, path: string[]): unknown | symbol =>
  path.reduce(
    (acc, currentVal) =>
      acc && Object.prototype.hasOwnProperty.call(acc, currentVal)
        ? acc[currentVal]
        : badPathSymbol,
    object
  )
