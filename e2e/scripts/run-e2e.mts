#!/usr/bin/env node

import { execFileSync } from 'child_process'
import path from 'node:path'
import { parseArgs } from 'node:util'

function formatCommandForLog(command: string, args: string[]) {
  const quoteIfNeeded = (value: string) => {
    if (value === '') return '""'
    if (/[^A-Za-z0-9_./\\:-]/.test(value)) {
      return `"${value.replaceAll('"', '\\"')}"`
    }
    return value
  }

  return [command, ...args].map(quoteIfNeeded).join(' ')
}

const bddgenCliPath = path.join(
  process.cwd(),
  'node_modules',
  'playwright-bdd',
  'dist',
  'cli',
  'index.js'
)

const playwrightCliPath = path.join(
  process.cwd(),
  'node_modules',
  '@playwright',
  'test',
  'cli.js'
)

const rawArgs = process.argv.slice(2)
const cleanedArgs =
  rawArgs.length >= 2 && rawArgs[1] === '--'
    ? [rawArgs[0], ...rawArgs.slice(2)]
    : rawArgs

const { values, positionals } = parseArgs({
  args: cleanedArgs,
  allowPositionals: true,
  strict: false,
  options: {
    tags: { type: 'string' },
    'skip-build': { type: 'boolean' },
  },
})

// Get client from first positional argument
const clientName = (positionals[0] as string | undefined) ?? ''
// Forward everything else (including unknown flags) to Playwright
let playwrightArgs = positionals.slice(1).map(String)
if (playwrightArgs[0] === '--') playwrightArgs = playwrightArgs.slice(1)

// if (!clientName) {
//   console.error('Error: Client name required')
//   console.error('Usage: node e2e/scripts/run-e2e.mts <client>')
//   process.exit(1)
// }

// Run bddgen and playwright

try {
  // eslint-disable-next-line no-console
  console.log(`Running e2e tests for client: ${clientName}`)

  const tagsExpression = values.tags ? String(values.tags) : ''

  if (tagsExpression) {
    // eslint-disable-next-line no-console
    console.log(`Using tags expression: ${tagsExpression}`)
  }

  // Run bddgen with PLAYWRIGHT_CLIENT environment variable
  const bddgenArgs = [
    bddgenCliPath,
    ...(tagsExpression ? ['--tags', tagsExpression] : []),
  ]
  // eslint-disable-next-line no-console
  console.log('executing: ' + formatCommandForLog(process.execPath, bddgenArgs))
  // eslint-disable-next-line no-console
  console.log(
    'equivalent: ' +
      formatCommandForLog('npx', [
        'bddgen',
        ...(tagsExpression ? ['--tags', tagsExpression] : []),
      ])
  )
  execFileSync(process.execPath, bddgenArgs, {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_CLIENT: clientName },
  })

  // Run playwright with PLAYWRIGHT_CLIENT environment variable
  const pwArgs = [playwrightCliPath, 'test', ...playwrightArgs]
  // eslint-disable-next-line no-console
  console.log('executing: ' + formatCommandForLog(process.execPath, pwArgs))
  // eslint-disable-next-line no-console
  console.log(
    'equivalent: ' +
      formatCommandForLog('npx', ['playwright', 'test', ...playwrightArgs])
  )
  execFileSync(process.execPath, pwArgs, {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_CLIENT: clientName },
  })
} catch (error) {
  // eslint-disable-next-line no-console
  // console.error(error)
  const exitCode =
    error && typeof error === 'object' && 'status' in error
      ? (error as { status: number }).status || 1
      : 1
  process.exit(exitCode)
}
