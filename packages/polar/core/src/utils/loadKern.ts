const theme = {
	color: {
		action: {
			default: 'oklch(var(--brand-color-l) var(--brand-color-c) var(--brand-color-h))',
			stateIndicator: {
				shade: {
					hover: 'oklch(calc(var(--brand-color-l) + 0.1) var(--brand-color-c) var(--brand-color-h))',
					active: 'oklch(calc(var(--brand-color-l) + 0.14) var(--brand-color-c) var(--brand-color-h))',
				},
			},
		},
	},
	metric: {
		space: {
			default: '8px',
		},
		borderRadius: {
			default: '0 20px 0 0',
		}
	},
}

export async function loadKern(host: ShadowRoot) {
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
