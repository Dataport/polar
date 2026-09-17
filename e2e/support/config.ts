/**
 * Shared test configuration values.
 *
 * Centralizes environment-derived config so step definitions and fixtures read
 * from a single source instead of re-deriving it from `process.env` inline.
 */

/** Base URL of the mock map server used by the `mockMap` fixture. */
export const MOCK_MAP_BASE_URL =
	process.env.MOCK_MAP_URL ?? 'http://127.0.0.1:3579'

/** Base URL of the vite dev server hosting the example clients. */
export const CLIENT_BASE_URL =
	process.env.CLIENT_BASE_URL ?? 'http://127.0.0.1:1234'

/**
 * Keeps debug screenshots of passing scenarios instead of failures only.
 *
 * Enable via `E2E_DEBUG_SCREENSHOTS=1` or `npm run test:e2e -- --debug-screenshots`.
 */
export const DEBUG_SCREENSHOTS = /^(1|true|on|yes)$/i.test(
	process.env.E2E_DEBUG_SCREENSHOTS ?? ''
)

/** Client name to entry path, relative to the vite dev server root. */
export const CLIENT_ENTRY_PATHS: Record<string, string> = {
	generic: '/examples/generic/',
	iceberg: '/examples/iceberg/',
	snowbox: '/examples/snowbox/',
}

/** Client used when neither a `@client_*` tag nor `PLAYWRIGHT_CLIENT` is set. */
export const DEFAULT_CLIENT = 'snowbox'

/**
 * Resolves the entry path of the client a scenario belongs to.
 *
 * @param tags - Tags of the running scenario, e.g. `['@client_snowbox']`.
 * @returns Path to the client's `index.html`, relative to the dev server root.
 */
export function getClientEntryPath(tags: readonly string[] = []): string {
	const taggedClient = tags
		.map((tag) => tag.replace(/^@client_/, ''))
		.find((name) => name in CLIENT_ENTRY_PATHS)
	const client = taggedClient ?? process.env.PLAYWRIGHT_CLIENT ?? DEFAULT_CLIENT
	const entryPath = CLIENT_ENTRY_PATHS[client]

	if (!entryPath) {
		throw new Error(
			`No entry path configured for client "${client}". ` +
				`Known clients: ${Object.keys(CLIENT_ENTRY_PATHS).join(', ')}`
		)
	}

	return entryPath
}
