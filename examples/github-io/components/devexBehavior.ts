import type { TabId } from './devexContent'

export const escapeHtml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const highlightCode = (code: string) =>
	escapeHtml(code)
		.replace(/('[^']*'|"[^"]*")/g, '<span class="lp-token-str">$1</span>')
		.replace(
			/(import|from|await|const|export|async|function)/g,
			'<span class="lp-token-kw">$1</span>'
		)
		.replace(/(\/\*.*)/g, '<span class="lp-token-cm">$1</span>')
		.replace(/(\*\\.*)/g, '<span class="lp-token-cm">$1</span>')
		.replace(/(^#[^\n]*)/gm, '<span class="lp-token-cm">$1</span>')
		.replace(
			/(createMap|createApp|addPlugins|pluginIconMenu|pluginLayerChooser|pluginScale)\b/g,
			'<span class="lp-token-fn">$1</span>'
		)

export function nextTabId(
	tabs: readonly { id: TabId }[],
	currentTabId: TabId,
	direction: 1 | -1
): TabId {
	const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId)
	const nextIndex = (currentIndex + direction + tabs.length) % tabs.length
	return tabs[nextIndex].id
}
