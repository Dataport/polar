let idIncrementor = 0;

/**
 * Returns a unique id. Can be used with prefix and suffix.
 * @param prefix
 * @param suffix
 * @returns {string}
 */
export function getUniqueId(prefix = "", suffix = "") {
  const idInfix = Math.random().toString(16).substring(2);

  return `${prefix}${idInfix}${idIncrementor++}${suffix}`;
}
