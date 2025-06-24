import { defineCustomElements } from '@public-ui/components/dist/loader'
import { register, KoliBriDevHelper } from '@public-ui/components'
import { setTagNameTransformer } from '@public-ui/vue'
import { DEFAULT } from '@public-ui/themes'

export async function loadKoliBri (tagPrefix: string) {
	const kolibriOptions = {
		transformTagName: (tagName: string) => `${tagPrefix}-${tagName}`,
	}
	setTagNameTransformer(kolibriOptions.transformTagName)
	await register(
		patch => DEFAULT((name, map, options) => {
			console.log({name,map,options})
			map.GLOBAL += '@layer kol-theme-global { @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css") }'
			return patch(name, map, options)
		}),
		args => defineCustomElements(args, kolibriOptions),
		kolibriOptions
	)
}
