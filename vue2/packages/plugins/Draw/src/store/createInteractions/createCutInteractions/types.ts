import { WriteOptions } from 'ol/format/Feature'

export type ProjectionInfo = Required<
  Pick<WriteOptions, 'dataProjection' | 'featureProjection'>
>
