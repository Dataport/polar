import type { Config } from 'stylelint'

export default {
	extends: ['stylelint-config-recommended', 'stylelint-config-recommended-vue'],
	plugins: ['stylelint-value-no-unknown-custom-properties'],
	rules: {
		/* eslint-disable @typescript-eslint/naming-convention */
		'csstools/value-no-unknown-custom-properties': [
			true,
			{
				importFrom: [
					'./variables.css',
					'../../node_modules/@kern-ux/native/dist/kern.css',
				],
			},
		],
		/* eslint-enable @typescript-eslint/naming-convention */
	},
} satisfies Config
