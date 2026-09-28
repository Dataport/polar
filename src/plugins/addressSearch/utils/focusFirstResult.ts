export function focusFirstResult(
	searchResultsLength: number,
	shadowRoot: ShadowRoot,
	event?: KeyboardEvent
) {
	for (let i = 0; i < searchResultsLength; i++) {
		const firstFocusableElement = shadowRoot.getElementById(
			`polar-plugin-address-search-results-feature-${i}-0`
		)
		if (firstFocusableElement) {
			firstFocusableElement.focus()
			// prevent list scrolling on newly focused element
			event?.preventDefault()
			break
		}
	}
}

if (import.meta.vitest) {
	const { beforeEach, expect, test, vi } = import.meta.vitest

	beforeEach(() => {
		vi.clearAllMocks()
	})

	const createElement = () => {
		const focus = vi.fn()
		return { focus, element: { focus } as unknown as HTMLElement }
	}

	const createShadowRoot = (
		implementation: (id: string) => HTMLElement | null = () => null
	) => {
		const getElementById = vi.fn(implementation)
		return {
			getElementById,
			shadowRoot: { getElementById } as unknown as ShadowRoot,
		}
	}

	test('focuses the first available result element', () => {
		const { focus, element } = createElement()
		const { shadowRoot } = createShadowRoot((id) =>
			id === 'polar-plugin-address-search-results-feature-0-0' ? element : null
		)

		focusFirstResult(3, shadowRoot)

		expect(focus).toHaveBeenCalledTimes(1)
	})

	test('skips missing ids and focuses the first existing element', () => {
		const { focus, element } = createElement()
		const { getElementById, shadowRoot } = createShadowRoot((id) =>
			id === 'polar-plugin-address-search-results-feature-2-0' ? element : null
		)

		focusFirstResult(3, shadowRoot)

		expect(getElementById).toHaveBeenCalledTimes(3)
		expect(focus).toHaveBeenCalledTimes(1)
	})

	test('does nothing when no element is found', () => {
		const { getElementById, shadowRoot } = createShadowRoot()

		expect(() => {
			focusFirstResult(2, shadowRoot)
		}).not.toThrow()
		expect(getElementById).toHaveBeenCalledTimes(2)
	})

	test('prevents default on the passed event to avoid list scrolling', () => {
		const { element } = createElement()
		const { shadowRoot } = createShadowRoot(() => element)
		const preventDefault = vi.fn()
		const event = { preventDefault } as unknown as KeyboardEvent

		focusFirstResult(1, shadowRoot, event)

		expect(preventDefault).toHaveBeenCalledTimes(1)
	})

	test('works without an event being passed', () => {
		const { focus, element } = createElement()
		const { shadowRoot } = createShadowRoot(() => element)

		expect(() => {
			focusFirstResult(1, shadowRoot)
		}).not.toThrow()
		expect(focus).toHaveBeenCalledTimes(1)
	})
}
