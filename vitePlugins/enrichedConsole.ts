import { resolve } from 'node:path'
import MagicString from 'magic-string'

const fileRegex = /\.(ts|js|vue)$/
const consoleRegex = /console\.(log|warn|error|info)\(/g

function stripId(id: string): string | null {
	const root = resolve(__dirname, '..', 'src')
	if (!id.startsWith(root)) {
		return null
	}
	id = id.slice(root.length + 1)
	if (id.endsWith('.ts')) {
		id = id.slice(0, id.length - 3)
	} else if (id.endsWith('.js')) {
		id = id.slice(0, id.length - 3)
	} else if (id.endsWith('.vue')) {
		id = id.slice(0, id.length - 4)
	}
	return id
}

type ConsoleType = 'log' | 'info' | 'warn' | 'error'
function generateConsolePrefix(info: {
	type: ConsoleType
	id: string
	line: number
	col: number
}): string {
	return `@polar/polar(${info.id}:${info.line}:${info.col})\n`
}

export default function enrichedConsole() {
	return {
		name: 'enriched-console',
		enforce: 'pre',
		transform(code: string, id: string) {
			const shortId = stripId(id)
			if (fileRegex.exec(id) && shortId !== null) {
				const s = new MagicString(code)
				let match: RegExpExecArray | null
				while ((match = consoleRegex.exec(code)) !== null) {
					const linebreaks = [...code.slice(0, match.index).matchAll(/\n/g)]
					const hint = generateConsolePrefix({
						type: match[1] as ConsoleType,
						id: shortId,
						line: linebreaks.length + 1,
						col: match.index - linebreaks[linebreaks.length - 1].index,
					})
					const hintJs = `${JSON.stringify(hint)}, `
					const index = match.index + match[0].length
					s.appendLeft(index, hintJs)
				}
				return {
					code: s.toString(),
					map: s.generateMap(),
				}
			}
			return { code, map: null }
		},
	}
}
