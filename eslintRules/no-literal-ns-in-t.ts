import type { Rule } from 'eslint'

/**
 * Enforces that the `ns` option in `t`/`$t` calls uses a constant identifier
 * (e.g. `PluginId` or `CoreId`) instead of a hard-coded string literal.
 *
 * Bad:  `t(($) => $.key, { ns: 'filter' })`
 * Good: `t(($) => $.key, { ns: PluginId })`
 */
const noLiteralNsInT: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Enforce using `PluginId`/`CoreId` identifier instead of a string literal for the `ns` option in `t`/`$t` calls',
		},
		messages: {
			useLiteralId:
				'Use the `PluginId` (or `CoreId`) constant instead of the string literal "{{ ns }}" as the `ns` option.',
		},
		schema: [],
	},
	create(context) {
		return {
			/* eslint-disable @typescript-eslint/naming-convention */
			CallExpression(node) {
				const { callee } = node
				if (
					callee.type !== 'Identifier' ||
					(callee.name !== 't' && callee.name !== '$t')
				) {
					return
				}

				for (const arg of node.arguments) {
					if (arg.type !== 'ObjectExpression') {
						continue
					}

					for (const prop of arg.properties) {
						if (
							prop.type === 'Property' &&
							!prop.computed &&
							((prop.key.type === 'Identifier' && prop.key.name === 'ns') ||
								(prop.key.type === 'Literal' && prop.key.value === 'ns')) &&
							prop.value.type === 'Literal' &&
							typeof prop.value.value === 'string'
						) {
							context.report({
								node: prop.value,
								messageId: 'useLiteralId',
								data: { ns: prop.value.value },
							})
						}
					}
				}
			},
			/* eslint-enable @typescript-eslint/naming-convention */
		}
	},
}

export default noLiteralNsInT
