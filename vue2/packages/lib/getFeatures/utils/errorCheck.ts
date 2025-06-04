/**
 * prints a helpful message regarding network errors
 */
export function errorCheck(response: Response) {
  if (!response.ok) {
    throw new Error(
      `getFeatures/parseGazetteerResponse: ${
        response.status === 418
          ? 'The server refuses to brew coffee because it is, permanently, a teapot.'
          : `The received status code ${response.status} indicates an error.`
      }`
    )
  }
}
