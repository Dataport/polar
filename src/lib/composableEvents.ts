import { onScopeDispose } from 'vue'

export function onSetup(callback: () => void) {
	callback()
}

export function onTeardown(callback: () => void) {
	onScopeDispose(() => {
		callback()
	})
}
