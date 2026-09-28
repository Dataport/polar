import type { ResourceKey } from 'i18next'

type MockedSelectorFn = ($: Record<string, ResourceKey>) => string

export function mockedT(
	keyFn: MockedSelectorFn,
	options: {
		ns: string
		context?: string
		count?: number
	}
) {
	const target = {
		keys: [] as string[],
	}
	const proxy = new Proxy(target, {
		get(target, prop) {
			if (prop === Symbol.toPrimitive) {
				return () => target.keys.join('.')
			}
			target.keys.push(prop.toString())
			return proxy
		},
	})
	return `$t(${options.ns}:${keyFn(proxy)}${options.context ? `_${options.context}` : ''}${options.count ? `_${options.count}` : ''})`
}
