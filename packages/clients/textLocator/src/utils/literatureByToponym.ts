const urlSuffix = {
  lookUpLocationsIndividually: '/lookup/locations_individually',
}

type LiteratureName = string
type Toponym = string

export type TitleLocationFrequency = Record<
  LiteratureName,
  Record<Toponym, number>
>

export async function searchLiteratureByToponym(
  url: string,
  names: string[]
): Promise<TitleLocationFrequency> {
  if (!names.length) {
    return Promise.resolve({})
  }
  const response = await fetch(
    `${url}${urlSuffix.lookUpLocationsIndividually}`,
    {
      method: 'POST',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: `{"location_names":${JSON.stringify(names)}}`,
    }
  )
  return ((await response.json()).title_location_freq ||
    {}) as TitleLocationFrequency
}
