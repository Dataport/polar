import type { Plugin } from 'vue'
import { defineCustomElements } from '@public-ui/components/dist/loader'
import { register } from '@public-ui/components'
import { DEFAULT } from '@public-ui/themes'

export const ComponentLibrary: Plugin = {
	async install() {
		await register(DEFAULT, defineCustomElements)
	},
}
