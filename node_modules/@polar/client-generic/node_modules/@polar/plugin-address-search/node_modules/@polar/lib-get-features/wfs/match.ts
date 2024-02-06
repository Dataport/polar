// code doesn't produce RegExpMatchArray where index is not set ... :|
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export type Separator = string
export type Slot = RegExpMatchArray
export type Block = Slot | Separator

const blockMemo = {} // memoize

/**
 * splits pattern strings to slots/separators by handlebars
 */
export const getBlocks = (pattern: string): Block[] => {
  if (blockMemo[pattern]) {
    return blockMemo[pattern]
  }

  const matches: RegExpMatchArray[] = Array.from(pattern.matchAll(/{{(.*?)}}/g))
  const blocks: Block[] = []

  let index = 0

  for (const match of matches) {
    if (index < match.index!) {
      blocks.push(pattern.substring(index, match.index))
      index = match.index!
    }
    blocks.push(match)
    index += match[0].length
  }

  blockMemo[pattern] = blocks

  return blocks
}

const sortComparableMatches = (comparableA, comparableB) => {
  // first sort by uninterpreted search string (strong indicator)
  if (comparableA.uninterpreted > comparableB.uninterpreted) return 1
  if (comparableA.uninterpreted < comparableB.uninterpreted) return -1
  // if same, sort by pattern fulfillment (weaker, searches will be incomplete)
  // NOTE currently deactivated
  // if (comparableA.patternLengthDiff > comparableB.patternLengthDiff) return 1
  // if (comparableA.patternLengthDiff < comparableB.patternLengthDiff) return -1
  // prefer first declared
  if (comparableA.index > comparableB.index) return 1
  if (comparableA.index < comparableB.index) return -1
  // don't go here
  return 0
}

/**
 * rates matches by
 *  1. uninterpreted string rest (strong weight)
 *  2. pattern fulfillment
 */
const sortMatches = (
  matches: string[][][],
  patterns: string[],
  uninterpretedCharacters: number[]
): string[][][] => {
  const comparableMatches = matches.map((match, index) => ({
    match,
    uninterpreted: uninterpretedCharacters[index],
    patternLengthDiff:
      (patterns[index].match(/{{/g) || []).length - match.length,
    index,
  }))
  const sortedMatches = [...comparableMatches]
    .sort(sortComparableMatches)
    .map(({ match }) => match)

  // remove duplicates and empty matches
  const known: string[] = []
  const sortedFilteredMatches = sortedMatches.filter((match) => {
    if (match.length === 0) {
      return false
    }
    const asString = JSON.stringify(match)
    if (known.includes(asString)) {
      return false
    }
    known.push(asString)
    return true
  })

  return sortedFilteredMatches
}

/**
 * matches an input string to patterns
 */
export const match = (
  patterns: string[],
  patternKeys: Record<string, string>,
  inputValue: string
): string[][][] => {
  const matches: string[][][] = []
  const uninterpretedCharacters: number[] = []
  patterns.forEach((pattern) => {
    const patternBlocks = getBlocks(pattern)
    const patternMapping: string[][] = []
    let traverseInput = inputValue

    patternBlocks.forEach((block) => {
      let skipper = ''
      if (Array.isArray(block)) {
        // Slot case
        const patternName = block[1]
        const patternRegExp = patternKeys[patternName]
        const value = traverseInput.match(new RegExp('^' + patternRegExp))
        if (value !== null) {
          const capturingGroupContent = value[1]
          patternMapping.push([patternName, capturingGroupContent.trim()])
          skipper = value[0].trim()
        }
      } else {
        // Separator case
        skipper = block.trim()
      }
      if (traverseInput.startsWith(skipper)) {
        traverseInput = traverseInput.substring(skipper.length).trim()
      }
    })

    uninterpretedCharacters.push(traverseInput.length)
    matches.push(patternMapping)
  })

  const sortedMatches = sortMatches(matches, patterns, uninterpretedCharacters)

  return sortedMatches
}
