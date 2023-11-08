/**
 * Adds thousands separators into a number and changes the decimal point
 *
 * @param num - the number as number or string
 * @param delimAbs - the letter(s) to use as thousand point
 * @param delimDec - the letter(s) to use as decimal point
 * @returns the given number with thousands separators or an empty string if any invalid num was given
 */
function thousandsSeparator(
  num: number | string,
  delimAbs = '.',
  delimDec = ','
): string {
  const value = typeof num !== 'string' ? num.toString() : num
  const decPointPos = value.indexOf('.')
  const abs = decPointPos > -1 ? value.substring(0, decPointPos) : value
  const result = abs.replace(/\B(?=(\d{3})+(?!\d),?.*)/g, delimAbs)
  const dec = decPointPos > -1 ? value.substring(decPointPos + 1) : false

  return dec ? result + delimDec + dec : result
}

export default thousandsSeparator
