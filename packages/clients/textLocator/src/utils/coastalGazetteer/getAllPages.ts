import { CoreGetters, CoreState, PolarStore } from '@polar/lib-custom-types'
import { MakeRequestBodyParameters, ResponsePayload } from './types'
import { makeRequestBody } from './makeRequestBody'

const getEmptyResponsePayload = (): ResponsePayload => ({
  count: '',
  currentpage: '',
  pages: '',
  keyword: '',
  querystring: '',
  results: [],
  time: NaN,
})

const mergeResponses = (
  initialResponse: ResponsePayload,
  responses: ResponsePayload[]
) => ({
  ...initialResponse,
  currentpage: 'merged',
  results: [
    initialResponse.results,
    ...responses.map(({ results }) => results),
  ].flat(1),
  time: NaN, // not used, setting NaN to indicate it's not the actual time
})

const fetchParams = {
  method: 'POST',
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}

const loadLengthInfoToast: [string, object] = [
  'plugin/toast/addToast',
  {
    type: 'info',
    text: 'textLocator.info.loadingTime',
    timeout: 10000,
  },
]

const loadErrorInfoToast: [string, object] = [
  'plugin/toast/addToast',
  {
    type: 'error',
    text: 'textLocator.error.searchCoastalGazetteer',
  },
]

export async function getAllPages(
  this: PolarStore<CoreState, CoreGetters>,
  signal: AbortSignal,
  url: string,
  params: Partial<MakeRequestBodyParameters>,
  epsg: `EPSG:${string}`
): Promise<ResponsePayload> {
  const response = await fetch(url, {
    ...fetchParams,
    body: new TextEncoder().encode(makeRequestBody(params, epsg)),
    signal,
  })

  if (!response.ok) {
    this.dispatch(...loadErrorInfoToast)
    console.error('Gazetteer response:', response)
    return getEmptyResponsePayload()
  }

  const responsePayload: ResponsePayload = await response.json()
  const pages = parseInt(responsePayload.pages, 10)
  const initialRequestMerge = typeof params.page === 'undefined' && pages > 1

  if (!initialRequestMerge) {
    return responsePayload
  }

  if (Number(responsePayload.count) > 10) {
    this.dispatch(...loadLengthInfoToast)
  }

  return mergeResponses(
    responsePayload,
    await Promise.all(
      Array.from(Array(pages - 1)).map((_, index) =>
        getAllPages.call(
          this,
          signal,
          url,
          {
            ...params,
            page: `${index + 2}`,
          },
          epsg
        )
      )
    )
  )
}
