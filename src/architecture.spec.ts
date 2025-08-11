import { resolve } from 'node:path'
import { beforeAll, describe, expect, test } from 'vitest'
import { FileConditionBuilder, filesOfProject } from 'tsarch'

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

	test('Core should not depend on plugins', async () => {
		const violations = await files
			.matchingPattern('core/.*')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('plugins/.*')
			.check()
		expect(violations).toEqual([])
	})

	test('Plugin file structure', async () => {
		const violations = await files
			.matchingPattern('plugins/.*')
			.should()
			.matchPattern(
				'plugins/[^/]+/((index|locales|store|types)\\.ts|utils/.*\\.ts)'
			)
			.check()
		expect(violations).toEqual([])
	})
})
