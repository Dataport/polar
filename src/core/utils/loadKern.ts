import type { KernThemeOverride } from '@kern-ux-annex/webc'
import kernExtraIcons from 'virtual:kern-extra-icons'

export async function loadKern(
	host: ShadowRoot,
	theme: KernThemeOverride = {}
) {
	const externalStyle = document.getElementById('kern-styles')
	if (externalStyle) {
		externalStyle.id = 'polar-kern-styles'
	}

	const { applyKernTheme } = await import('@kern-ux-annex/webc')
	applyKernTheme({ theme }, host.querySelector('.polar-wrapper') as HTMLElement)

	const kernStyle = document.getElementById('kern-styles')
	if (kernStyle) {
		const kernSheet = new CSSStyleSheet()
		kernSheet.replaceSync(kernStyle.innerText.replaceAll(':root', ':host'))
		host.adoptedStyleSheets.push(kernSheet)
		kernStyle.remove()
	}

	host.adoptedStyleSheets.push(kernExtraIcons)

	if (externalStyle) {
		externalStyle.id = 'kern-styles'
	}
}

if (import.meta.hot) {
	import.meta.hot.on('kern-extra-icons', ({ icons }) => {
		icons.forEach((icon) => kernExtraIcons.insertRule(icon))
	})
}
