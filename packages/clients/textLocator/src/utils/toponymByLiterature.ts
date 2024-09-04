import { Literature } from './findLiterature'
import urlSuffix from './urlSuffix'

/**
 * NOTE This endpoint is currently not in use. It's added for API completeness,
 * but only redundantly fetches information retrieved on a
 * 'findDocumentsByTitle' request as of now.
 * TODO decide whether this can be deleted before merging the PR.
 */
export async function searchToponymByLiterature(
  url: string,
  id: string
): Promise<Literature> {
  const response = await fetch(`${url}${urlSuffix.locationsToText}`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: `{"id":${JSON.stringify(id)}}`,
  })
  return (await response.json()) as Literature
}
