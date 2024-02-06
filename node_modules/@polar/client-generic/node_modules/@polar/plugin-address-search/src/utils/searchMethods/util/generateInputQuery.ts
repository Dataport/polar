import { SearchParameters } from '@polar/lib-get-features'

/**
 * @param fieldName - fieldName(s) defined by the service.
 * @param inputValue - user input
 * @returns Object containing key value pairs of fieldName to input.
 */
export default function (
  fieldName: string | string[],
  inputValue: string
): SearchParameters {
  if (Array.isArray(fieldName)) {
    const inputValueArray = inputValue.split(' ')
    return fieldName.reduce(
      (previous, current, index) => ({
        ...previous,
        [current]: inputValueArray[index],
      }),
      {}
    )
  }
  return { [fieldName]: inputValue }
}
