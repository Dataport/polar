import { getStore, subscribe } from '@polar/polar'

const CONTAINER_ID = 'polar-plugin-states'

/** Serializes arbitrary store values to a string. */
function safeStringify(value) {
	if (value === undefined) {
		return 'undefined'
	}
	const seen = new WeakSet()
	try {
		return JSON.stringify(
			value,
			(_key, val) => {
				if (typeof val === 'bigint' || typeof val === 'symbol') {
					return val.toString()
				}
				if (typeof val === 'function') {
					return '[Function]'
				}
				if (val instanceof Set) {
					return [...val]
				}
				if (val instanceof Map) {
					return Object.fromEntries(val)
				}
				if (val && typeof val === 'object') {
					if (seen.has(val)) {
						return '[Circular]'
					}
					seen.add(val)
					// Reduce class instances to their name
					const name = Object.getPrototypeOf(val)?.constructor?.name
					if (name && name !== 'Object' && name !== 'Array') {
						return `[${name}]`
					}
				}
				return val
			},
			2
		)
	} catch {
		return String(value)
	}
}

/** Creates the DOM node that displays a single state value and returns it. */
function createEntry(section, storeName, key) {
	const entry = document.createElement('div')
	entry.className = 'polar-plugin-states__entry'
	entry.id = `plugin-state-${storeName}-${key}`
	entry.dataset.store = storeName
	entry.dataset.key = key

	const keyEl = document.createElement('span')
	const valueEl = document.createElement('pre')
	keyEl.textContent = key
	entry.append(keyEl, valueEl)
	section.append(entry)
	return valueEl
}

/**
 * Renders every reactive state field of the core store and all active plugin
 * stores into `#polar-plugin-states`, keeping each value in sync with the store.
 *
 * @param map - The POLAR map instance whose stores should be exposed.
 */
export function displayPluginStates(map) {
	const container = document.getElementById(CONTAINER_ID)
	if (!container) {
		return
	}
	container.textContent = ''

	const heading = document.createElement('h2')
	heading.textContent = 'Plugin states'
	container.append(heading)

	const coreStore = getStore(map, 'core')
	const storeNames = ['core', ...[...coreStore.usedPlugins].sort()]

	for (const storeName of storeNames) {
		const store = getStore(map, storeName)
		if (!store?.$state) {
			continue
		}

		const section = document.createElement('div')
		section.className = 'polar-plugin-states__store'
		section.dataset.store = storeName

		const title = document.createElement('h3')
		title.textContent = storeName
		section.append(title)
		container.append(section)

		for (const key of Object.keys(store.$state).sort()) {
			const valueEl = createEntry(section, storeName, key)
			subscribe(map, storeName, key, (value) => {
				valueEl.textContent = safeStringify(value)
			})
		}
	}
}
