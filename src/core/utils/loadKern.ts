import kernCss from '@kern-ux/native/dist/kern.min.css?raw'
import kernExtraIcons from 'virtual:kern-extra-icons'
import type { KernTheme, KernThemeTree } from '../types'

function flattenKernTheme(theme: KernThemeTree, prefix: string[] = []) {
	return Object.entries(theme).flatMap(([k, v]) => {
		const keys = [...prefix, k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())]
		if (typeof v === 'string') return [[`kern-${keys.join('-')}`, v]]
		return flattenKernTheme(v, keys)
	})
}

function buildKernTheme(theme: Partial<KernTheme>): CSSStyleSheet {
	const sheet = new CSSStyleSheet()
	const flatTheme = flattenKernTheme(theme)
	sheet.replaceSync(`
		:host {
			${flatTheme.map(([k, v]) => `--${k}: ${v} !important;`).join('\n')}
		}
	`)
	return sheet
}

export function loadKern(host: ShadowRoot, theme: Partial<KernTheme> = {}) {
	const kernSheet = new CSSStyleSheet()
	kernSheet.replaceSync(kernCss.replaceAll(':root', ':host'))
	host.adoptedStyleSheets.push(kernSheet)

	const kernTheme = buildKernTheme(theme)
	host.adoptedStyleSheets.push(kernTheme)

	host.adoptedStyleSheets.push(kernExtraIcons)
}

if (import.meta.hot) {
	import.meta.hot.on('kern-extra-icons', ({ icons }) => {
		icons.forEach((icon) => kernExtraIcons.insertRule(icon))
	})
}
