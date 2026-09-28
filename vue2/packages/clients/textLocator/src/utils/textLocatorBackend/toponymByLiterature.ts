import { TitleLocationFrequency } from '../../types'
import urlSuffix from './urlSuffix'

export async function searchToponymByLiterature(
  url: string,
  id: string
): Promise<TitleLocationFrequency> {
  const response = await fetch(`${url}${urlSuffix.locationsToText}`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: `{"id":${JSON.stringify(id)}}`,
  })
  return ((await response.json()).title_location_freq ||
    {}) as TitleLocationFrequency
}
