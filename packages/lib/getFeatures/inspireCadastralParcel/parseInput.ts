export interface CadastralInput {
  kind: 'kennzeichen' | 'parcel' | 'zoning'
  reference?: string
  gemarkungName?: string
  gemarkungNumber?: string
  flur?: string
  zaehler?: string
  nenner?: string
  nennerOpen?: boolean
}

export const parseInput = (value: string): CadastralInput[] => {
  let input = value.trim().replace(/,/g, ' ').replace(/\s+/g, ' ')
  if (!input) {
    throw new Error('INSPIRE cadastral search requires an input.')
  }
  if (/^[0-9_]{6,20}$/.test(input)) {
    return [{ kind: 'kennzeichen', reference: input }]
  }

  const number = input.match(/\((\d{4}|\d{6})\)/)
  const gemarkungNumber = number?.[1]
  input = input
    .replace(/\((\d{4}|\d{6})\)/g, '')
    .replace(/^Gemarkung\s+/i, '')
    .replace(/Flurst(?:\u00fc|ue)ck\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  const explicitFlur = input.match(/^(.*?)\s+Flur\s+(\d{1,3})(?:\s+(.*))?$/i)
  let gemarkungName: string | undefined
  let flur: string | undefined
  let parcel: string | undefined
  if (explicitFlur) {
    gemarkungName = explicitFlur[1]
    flur = String(Number(explicitFlur[2]))
    parcel = explicitFlur[3]
  } else {
    const combined = input.match(
      /^(.*?)\s+(?:(\d{1,3})\s+)?(\d{1,5}(?:\/\d{0,4})?)$/
    )
    if (combined) {
      gemarkungName = combined[1]
      flur = combined[2] ? String(Number(combined[2])) : undefined
      parcel = combined[3]
    } else if (/^\d{1,5}(?:\/\d{0,4})?$/.test(input)) {
      parcel = input
    } else if (!/\d|\/|[()*!]/.test(input)) {
      gemarkungName = input
    } else {
      throw new Error(`Invalid INSPIRE cadastral search input: "${value}".`)
    }
  }
  if (gemarkungName && /[0-9/()*!]/.test(gemarkungName)) {
    throw new Error(`Invalid cadastral district name: "${gemarkungName}".`)
  }
  if (parcel && !/^\d{1,5}(?:\/\d{0,4})?$/.test(parcel)) {
    throw new Error(`Invalid cadastral parcel number: "${parcel}".`)
  }
  const [zaehler, nenner] = parcel?.split('/') ?? []
  return [
    {
      kind: parcel ? 'parcel' : 'zoning',
      gemarkungName,
      gemarkungNumber,
      flur,
      zaehler: zaehler ? String(Number(zaehler)) : undefined,
      nenner: nenner ? String(Number(nenner)) : undefined,
      nennerOpen: parcel?.endsWith('/') ?? false,
    },
  ]
}
