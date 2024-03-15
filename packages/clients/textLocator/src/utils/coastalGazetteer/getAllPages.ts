import { CoreState } from '@polar/lib-custom-types'
import { Store } from 'vuex'
import { MakeRequestUrlParameters, ResponsePayload } from './types'
import { makeRequestUrl } from './makeRequestUrl'

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

export async function getAllPages(
  this: Store<CoreState>,
  signal: AbortSignal,
  url: string,
  params: Partial<MakeRequestUrlParameters>,
  epsg: `EPSG:${string}`
): Promise<ResponsePayload> {
  const response = await fetch(makeRequestUrl(url, params, epsg), {
    method: 'GET',
    signal,
  })

  if (!response.ok) {
    this.dispatch('plugin/toast/addToast', {
      type: 'error',
      text: 'textLocator.error.searchCoastalGazetteer',
    })
    console.error('Gazetteer response:', response)
    return getEmptyResponsePayload()
  }
  const responsePayload: ResponsePayload = await response.json()
  const pages = parseInt(responsePayload.pages, 10)
  const initialRequestMerge = typeof params.page === 'undefined' && pages > 1

  if (!initialRequestMerge) {
    return responsePayload
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
