import type { SearchResult } from '@/core'

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

if (import.meta.vitest) {
	const { beforeEach, expect, test, vi } = import.meta.vitest

	const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

	beforeEach(() => {
		vi.clearAllMocks()
	})

	const createResult = (categoryId: string): SearchResult => ({
		categoryId,
		categoryLabel: categoryId,
		groupId: 'defaultGroup',
		features: { type: 'FeatureCollection', features: [] },
	})

	const rejected = (reason: unknown): PromiseSettledResult<SearchResult> => ({
		status: 'rejected',
		reason,
	})

	test('collects the values of fulfilled promises and ignores rejected ones', () => {
		const alpha = createResult('alpha')
		const beta = createResult('beta')
		const promises: PromiseSettledResult<SearchResult>[] = [
			{ status: 'fulfilled', value: alpha },
			rejected(new Error('boom')),
			{ status: 'fulfilled', value: beta },
		]

		const results = getResultsFromPromises(promises, new AbortController())

		expect(results).toEqual([alpha, beta])
	})

	test('logs rejected reasons when the search was not aborted', () => {
		const reason = new Error('boom')

		getResultsFromPromises([rejected(reason)], new AbortController())

		expect(errorSpy).toHaveBeenCalledTimes(1)
		expect(errorSpy).toHaveBeenCalledWith(
			expect.any(String),
			'An error occurred while sending a request: ',
			reason
		)
	})

	test('does not log rejected reasons when the search was aborted', () => {
		const abortController = new AbortController()
		abortController.abort()

		getResultsFromPromises([rejected(new Error('boom'))], abortController)

		expect(errorSpy).not.toHaveBeenCalled()
	})
}
