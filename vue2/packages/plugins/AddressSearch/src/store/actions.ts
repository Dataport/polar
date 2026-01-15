export const makeActions = () => {
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
	}

	return actions
}
