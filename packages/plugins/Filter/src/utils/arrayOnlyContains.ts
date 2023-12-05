export const arrayOnlyContains = (array: unknown[], value: unknown) =>
  array.reduce((accumulator, current) => accumulator && current === value, true)
