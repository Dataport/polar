export const arrayOnlyContains = (array: unknown[], value) =>
  array.reduce((accumulator, current) => accumulator && current === value, true)
