import type { SearchResult } from '../types'

export function getResultsFromPromises(
	promises: PromiseSettledResult<SearchResult>[],
	abortController: AbortController
) {
	const results = promises.reduce<SearchResult[]>(
		(acc, promise) =>
			promise.status === 'fulfilled' ? [...acc, promise.value] : acc,
		[]
	)

	// only print errors if search was not aborted
	if (!abortController.signal.aborted) {
		;(
			promises.filter(
				({ status }) => status === 'rejected'
			) as PromiseRejectedResult[]
		).forEach(({ reason }) => {
			console.error('An error occurred while sending a request: ', reason)
		})
	}

	return results
}
