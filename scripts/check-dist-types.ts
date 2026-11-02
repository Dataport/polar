/*
 * Type-checks the shipped declaration files in `dist/`.
 * `skipLibCheck` hides errors in them during regular type-checking.
 */
import { globSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import ts from 'typescript'

const distDir = resolve(import.meta.dirname, '..', 'dist') + sep
const rootNames = globSync('dist/**/*.d.ts').map((file) => resolve(file))

if (rootNames.length === 0) {
	console.error('No declaration files found in dist/. Run the build first.')
	process.exit(1)
}

const program = ts.createProgram(rootNames, {
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.ESNext,
	moduleResolution: ts.ModuleResolutionKind.Bundler,
	lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
	types: [],
	strict: true,
	noEmit: true,
	skipLibCheck: false,
})

const diagnostics = ts
	.getPreEmitDiagnostics(program)
	.filter((diagnostic) => diagnostic.file?.fileName.startsWith(distDir))

if (diagnostics.length > 0) {
	console.error(
		ts.formatDiagnosticsWithColorAndContext(diagnostics, {
			getCanonicalFileName: (fileName) => fileName,
			getCurrentDirectory: () => process.cwd(),
			getNewLine: () => '\n',
		})
	)
	console.error(`${diagnostics.length} error(s) in shipped declaration files.`)
	process.exit(1)
}

// eslint-disable-next-line no-console
console.info(`Checked ${rootNames.length} declaration files without errors.`)
