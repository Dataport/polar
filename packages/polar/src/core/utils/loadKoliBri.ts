import { defineCustomElements } from '@public-ui/components/dist/loader'
import { register } from '@public-ui/components'
import { setTagNameTransformer } from '@public-ui/vue'
import { DEFAULT } from '@public-ui/themes'

export async function loadKoliBri (tagPrefix: string) {
	const kolibriOptions = {
		transformTagName: (tagName: string) => `${tagPrefix}-${tagName}`,
	}
	setTagNameTransformer(kolibriOptions.transformTagName)
	await register(
		DEFAULT,
		args => defineCustomElements(args, kolibriOptions),
		kolibriOptions
	)
}
