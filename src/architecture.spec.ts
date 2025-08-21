import { resolve } from 'node:path'
import { beforeAll, describe, expect, test } from 'vitest'
import { FileConditionBuilder, filesOfProject } from 'tsarch'

describe('Architectural checks', () => {
	let files: FileConditionBuilder

	beforeAll(() => {
		files = filesOfProject(resolve(__dirname, 'tsconfig.json'))
	})

	test('POLAR should be cycle-free (except for types)', async () => {
		const violations = await files
			.matchingPattern('^(?!.*/types\\.ts$).*')
			.should()
			.beFreeOfCycles()
			.check()
		expect(violations).toEqual([])
	})

	test('Core should not depend on plugins (except for types)', async () => {
		const violations = await files
			.matchingPattern('^core/(?!types\\.ts$).*$')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('^plugins/.*$')
			.check()
		expect(violations).toEqual([])
	})

	test('Plugin file structure', async () => {
		const violations = await files
			.matchingPattern('^plugins/.*$')
			.should()
			.matchPattern(
				'^plugins/[^/]+/((index|locales|store|types)\\.ts|utils/.*\\.ts|components/.*\\.spec\\.ts)$'
			)
			.check()
		expect(violations).toEqual([])
	})

	test('Plugins should only depend on public core API', async () => {
		const violations = await files
			.matchingPattern('^plugins/.*$')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('^core/(?!(index|stores/export)\\.ts$).*$')
			.check()
		expect(violations).toEqual([])
	})
})
