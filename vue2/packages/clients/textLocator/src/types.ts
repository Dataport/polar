import { Feature } from 'geojson'

type LiteratureName = string
type LiteratureId = string
type Toponym = string

export type TitleLocationFrequency = Record<
  LiteratureId,
  {
    title: LiteratureName
    location_frequency: Record<Toponym, number>
  }
>

export interface LiteratureFeature extends Feature {
  properties: Record<Toponym, number>
  title: string
  id: string
}
