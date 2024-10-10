import { TitleLocationFrequency } from '../../types'
import urlSuffix from './urlSuffix'

export async function searchLiteratureByToponym(
  url: string,
  names: string[]
): Promise<TitleLocationFrequency> {
  if (!names.length) {
    return Promise.resolve({})
  }
  const response = await fetch(`${url}${urlSuffix.lookupLocation}`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: `{"location_names":${JSON.stringify(names)}}`,
  })
  return ((await response.json()).title_location_freq ||
    {}) as TitleLocationFrequency
}
