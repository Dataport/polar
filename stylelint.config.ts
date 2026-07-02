import type { Config } from 'stylelint'

import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.dirname(fileURLToPath(import.meta.url))

export default {
	extends: ['stylelint-config-recommended', 'stylelint-config-recommended-vue'],
	plugins: ['stylelint-value-no-unknown-custom-properties'],
	// TODO: Remove 'vue2/**' after migration
	ignoreFiles: ['examples/iceberg/**', 'vue2/**'],
	rules: {
		/* eslint-disable @typescript-eslint/naming-convention */
		'csstools/value-no-unknown-custom-properties': [
			true,
			{
				// Custom properties defined within the linted file are detected
				// automatically. Variables provided by external sources must be
				// declared here so they are not reported as unknown.
				importFrom: [
					// KERN design system variables, loaded at runtime via loadKern.ts.
					path.join(repoRoot, 'node_modules/@kern-ux/native/dist/kern.css'),
					{
						// Project-global custom properties defined on the POLAR
						// container host and inherited by all shadow-DOM components.
						customProperties: {
							'--brand-color-l': '0',
							'--brand-color-c': '0',
							'--brand-color-h': '0',
							'--polar-shadow-color': '0deg 0% 63%',
							'--polar-shadow': '0 0 0',
						},
					},
				],
			},
		],
		/* eslint-enable @typescript-eslint/naming-convention */
	},
	overrides: [
		{
			// Match all files within github-io, including nested folders like
			// `components/`. A single `*` does not cross directory boundaries.
			files: ['examples/github-io/**/*.{css,vue}'],
			rules: {
				/* eslint-disable @typescript-eslint/naming-convention */
				'csstools/value-no-unknown-custom-properties': [
					true,
					{
						importFrom: [
							path.join(repoRoot, 'examples/github-io/variables.css'),
							path.join(repoRoot, 'node_modules/@kern-ux/native/dist/kern.css'),
						],
					},
				],
				/* eslint-enable @typescript-eslint/naming-convention */
			},
		},
	],
} satisfies Config
