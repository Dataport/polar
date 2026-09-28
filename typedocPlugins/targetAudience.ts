import * as td from 'typedoc'

const targetAudiences = {
	core: [],
	plugin: ['internal'],
	client: ['internal', 'alpha'],
} as Record<string, string[]>

export function load(app: td.Application) {
	app.options.addDeclaration({
		type: td.ParameterType.String,
		name: 'targetAudience',
		help: 'Target audience for the generated documentation.',
		defaultValue: 'client',
	})

	app.converter.on(td.Converter.EVENT_RESOLVE_BEGIN, (context) => {
		const targetAudience = app.options.getValue('targetAudience') as string
		if (!Object.keys(targetAudiences).includes(targetAudience)) {
			app.logger.error('Invalid target audience: ' + targetAudience)
			return
		}
		const hiddenModifiers = targetAudiences[targetAudience]

		const project = context.project
		const reflections = Object.values(project.reflections)
		reflections
			.filter(({ comment }) =>
				hiddenModifiers.some((modifier) => comment?.hasModifier(`@${modifier}`))
			)
			.forEach((reflection) => {
				project.removeReflection(reflection)
			})
	})
}
