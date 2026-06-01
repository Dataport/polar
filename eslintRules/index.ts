import importStyle from './import-style.js'
import noLiteralNsInT from './no-literal-ns-in-t.js'

export default {
	rules: {
		/* eslint-disable @typescript-eslint/naming-convention */
		'import-style': importStyle,
		'no-literal-ns-in-t': noLiteralNsInT,
		/* eslint-enable @typescript-eslint/naming-convention */
	},
}
