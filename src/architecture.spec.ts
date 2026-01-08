import { resolve } from 'node:path'
import { FileConditionBuilder, filesOfProject } from 'tsarch'
import { beforeAll, describe, expect, test } from 'vitest'

describe('Architectural checks', () => {
	let files: FileConditionBuilder

	beforeAll(() => {
		files = filesOfProject(resolve(__dirname, 'tsconfig.json'))
	})

	test('POLAR should be cycle-free', async () => {
		const violations = await files
			.matchingPattern('.*')
			.should()
			.beFreeOfCycles()
			.check()
		expect(violations).toEqual([])
	})

	test('Core should not depend on plugins (except for plugin types)', async () => {
		const violations = await files
			.matchingPattern('^core/(?!types/.*\\.ts$).*$')
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
				'^plugins/[^/]+/((index|locales|store|types)\\.ts|utils/.*\\.ts|components/.*\\.spec\\.ts|stores/.*\\.ts|composables/.*\\.ts)$'
			)
			.check()
		expect(violations).toEqual([])
	})

	test('Plugins should only depend on public core API', async () => {
		const violations = await files
			.matchingPattern('^plugins/.*$')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('^core/(?!(index|stores/index)\\.ts$).*$')
			.check()
		expect(violations).toEqual([])
	})

	test('Lib utils should only depend on public core API', async () => {
		const violations = await files
			.matchingPattern('^lib/.*$')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('^core/(?!(index|stores/index)\\.ts$).*$')
			.check()
		expect(violations).toEqual([])
	})
})
