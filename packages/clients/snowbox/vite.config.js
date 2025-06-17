import { getClientConfig } from '../../../vue2/viteConfigs'

export default getClientConfig({
	base: '',
	build: {
		lib: {
			entry: 'polar-client.ts',
			name: 'POLAR snowbox',
		},
	},
})
