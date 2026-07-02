import type { Rule } from 'eslint'

import path from 'node:path'

/**
 * Returns the context key for a path that is already relative to srcRoot.
 *
 * Contexts:
 *   - "core"            → src/core/**
 *   - "plugins/<name>"  → src/plugins/<name>/**
 *   - "lib/<name>"      → src/lib/<name>/**
 *   - null              → everything else (no context)
 */
function getContext(srcRelPath: string): string | null {
	const parts = srcRelPath.split('/')
	if (parts[0] === 'core') {
		return 'core'
	}
	if (parts[0] === 'plugins' && parts.length > 1) {
		return `plugins/${parts[1]}`
	}
	if (parts[0] === 'lib' && parts.length > 1) {
		return `lib/${parts[1]}`
	}
	return null
}

/**
 * Resolves an import specifier to a path that is relative to srcRoot.
 * Handles both `@/…` (alias) and relative (`./`, `../`) specifiers.
 * Returns null when the specifier is external or resolves outside srcRoot.
 */
function resolveToSrcRel(
	importPath: string,
	currentSrcRel: string,
	srcRoot: string
): string | null {
	let abs: string
	if (importPath.startsWith('@/')) {
		abs = path.join(srcRoot, importPath.slice(2))
	} else if (importPath.startsWith('.')) {
		abs = path.resolve(
			path.join(srcRoot, path.dirname(currentSrcRel)),
			importPath
		)
	} else {
		return null
	}
	const rel = path.relative(srcRoot, abs).replace(/\\/g, '/')
	return rel.startsWith('..') ? null : rel
}

/**
 * Enforces POLAR import style conventions:
 *
 *  1. `.ts` extensions must be omitted in import/export sources.
 *  2. Same-context imports must use relative paths (`./` or `../`).
 *  3. Cross-context or context-less imports must use the `@/…` alias.
 *
 * A "context" is one of:
 *   - `core`             for every file inside `src/core/`
 *   - `plugins/<name>`   for every file inside `src/plugins/<name>/`
 *   - `lib/<name>`       for every file inside `src/lib/<name>/`
 *   - (none)             for all other files
 *
 * Files outside `srcDir` (default `"src"`) are ignored.
 *
 * @example rule options  { srcDir: "src" }
 */
const importStyle: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					srcDir: { type: 'string' },
				},
				additionalProperties: false,
			},
		],
		messages: {
			wrongPath: 'Import path "{{ actual }}" should be "{{ expected }}".',
		},
	},

	create(context) {
		const srcDirOption: string = context.options[0]?.srcDir ?? 'src'
		const srcRoot = path.resolve(context.cwd, srcDirOption)

		const currentSrcRel = path
			.relative(srcRoot, path.resolve(context.filename))
			.replace(/\\/g, '/')

		// File is outside srcRoot — skip entirely
		if (currentSrcRel.startsWith('..')) {
			return {}
		}

		const currentCtx = getContext(currentSrcRel)

		function check(sourceNode: { value?: unknown; raw?: string }) {
			if (typeof sourceNode.value !== 'string') {
				return
			}

			const raw = sourceNode.value

			// Only handle project-internal specifiers
			if (!raw.startsWith('@/') && !raw.startsWith('.')) {
				return
			}

			// Always strip the .ts extension
			const withoutExt = raw.endsWith('.ts') ? raw.slice(0, -3) : raw

			// Resolve to a srcRoot-relative path for context comparison
			const targetSrcRel = resolveToSrcRel(withoutExt, currentSrcRel, srcRoot)

			if (targetSrcRel === null) {
				// Cannot resolve within src (edge case) — only fix extension
				if (withoutExt !== raw) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const q = sourceNode.raw![0]
					context.report({
						node: sourceNode as Rule.Node,
						messageId: 'wrongPath',
						data: { actual: raw, expected: withoutExt },
						fix: (fixer) =>
							fixer.replaceText(
								sourceNode as Rule.Node,
								`${q}${withoutExt}${q}`
							),
					})
				}
				return
			}

			const targetCtx = getContext(targetSrcRel)

			// Determine the canonical form of this import
			let expected: string

			if (currentCtx !== null && currentCtx === targetCtx) {
				// Same context → relative path (no @/ alias)
				const currentDir = path.join(srcRoot, path.dirname(currentSrcRel))
				const targetAbs = path.join(srcRoot, targetSrcRel)
				let rel = path.relative(currentDir, targetAbs).replace(/\\/g, '/')
				if (rel === '') {
					// The target file's extension-stripped path is identical to the
					// current file's directory. This happens when a file imports a
					// sibling file whose name matches its own folder, e.g. importing
					// `../types.ts` from a file inside a folder named `types`.
					rel = `../${path.basename(targetAbs)}`
				} else if (!rel.startsWith('.')) {
					rel = `./${rel}`
				}
				expected = rel
			} else {
				// Cross-context or no context → alias
				expected = `@/${targetSrcRel}`
			}

			if (raw !== expected) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const q = sourceNode.raw![0]
				context.report({
					node: sourceNode as Rule.Node,
					messageId: 'wrongPath',
					data: { actual: raw, expected },
					fix: (fixer) =>
						fixer.replaceText(sourceNode as Rule.Node, `${q}${expected}${q}`),
				})
			}
		}

		return {
			/* eslint-disable @typescript-eslint/naming-convention */
			ImportDeclaration(node) {
				check(node.source)
			},
			ExportAllDeclaration(node) {
				check(node.source)
			},
			ExportNamedDeclaration(node) {
				if (node.source) {
					check(node.source)
				}
			},
			/* eslint-enable @typescript-eslint/naming-convention */
		}
	},
}

export default importStyle
