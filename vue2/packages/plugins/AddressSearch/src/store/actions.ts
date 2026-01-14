type AddressSearchAutoselect = 'first' | 'only' | 'never'

export const makeActions = () => {
	let abortController
	let methodContainer

	const actions = {
		setSelectedGroupId(
			{ commit, dispatch, state },
			selectedGroupId: string
		): void {
			commit('setSelectedGroupId', selectedGroupId)

			/* whenever the selected search group name changes,
			 * redo input – if it triggers a search, the user
			 * will probably want to see the results in new
			 * search service group */
			commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
			dispatch('input', state.inputValue)
		},
		/**
		 * `search` is meant for programmatic access. User search is triggered from
		 * the `input` action effects and features a debouncing mechanism.
		 * @param vuexParameters - vuex standard parameter object
		 * @param payload - input to search for and an autoselect mode
		 */
		async search(
			{ state, commit, dispatch, getters },
			{
				input,
				autoselect,
			}: { input: string; autoselect: AddressSearchAutoselect }
		): Promise<void> {
			commit('setInputValue', input)
			if (abortController) {
				abortController.abort()
				abortController = undefined
			}
			await dispatch('load')

			if (typeof state.searchResults === 'symbol') {
				// error or word too short, nothing to do
				return
			}

			const firstFound = state.searchResults.find(
				({ value }) => value.features.length
			)
			const firstFeatures = firstFound?.value?.features || []

			if (
				(autoselect === 'first' && firstFeatures.length >= 1) ||
				(autoselect === 'only' && firstFeatures.length === 1)
			) {
				dispatch('selectResult', {
					feature: firstFeatures[0],
					categoryId:
						getters.selectedGroup[firstFound?.index || 0].categoryId || '',
				})
			}
		},
	}

	return actions
}
