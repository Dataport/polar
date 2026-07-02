/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-recommended', 'stylelint-config-recommended-vue'],
	plugins: ['stylelint-value-no-unknown-custom-properties'],
	rules: {
		'csstools/value-no-unknown-custom-properties': [
			true,
			{
				importFrom: [
					'./variables.css',
					'../../node_modules/@kern-ux/native/dist/kern.css',
				],
			},
		],
	},
}
