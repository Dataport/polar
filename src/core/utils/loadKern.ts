import type { KernTheme } from '@kern-ux-annex/webc'

export async function loadKern(host: ShadowRoot, theme: KernTheme = {}) {
	const externalStyle = document.getElementById('kern-styles')
	if (externalStyle) {
		externalStyle.id = 'polar-kern-styles'
	}

	const { applyKernTheme } = await import('@kern-ux-annex/webc')
	applyKernTheme({ theme }, host.querySelector('.polar-wrapper'))

	const kernStyle = document.getElementById('kern-styles')
	if (kernStyle) {
		const kernSheet = new CSSStyleSheet()
		kernSheet.replaceSync(kernStyle.innerText.replaceAll(':root', ':host'))
		host.adoptedStyleSheets = [kernSheet]
		kernStyle.remove()
	}

	if (externalStyle) {
		externalStyle.id = 'kern-styles'
	}
}
