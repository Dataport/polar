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

function normalizeTag(tag: string) {
  return tag.startsWith('@') ? tag : `@${tag}`
}

function parseSimpleTagsSyntax(input: string) {
  const tokens = input.trim().split(/\s+/).filter(Boolean)

  const include: string[] = []
  const exclude: string[] = []

  for (const token of tokens) {
    const isExclude = token.startsWith('!')
    const rawTag = isExclude ? token.slice(1) : token

    // example: @smoke !@not_implemented !@fails
    if (
      /[()]/.test(token) ||
      /^(and|or|not)$/i.test(token) ||
      !/^@?[A-Za-z0-9_:-]+$/.test(rawTag)
    ) {
      throw new Error(
        `Unsupported --tags token: "${token}". Use: --tags "@tag !@excluded"`
      )
    }

    const normalized = normalizeTag(rawTag)
    if (isExclude) {
      exclude.push(normalized)
    } else {
      include.push(normalized)
    }
  }

  return { include, exclude }
}

function buildBddgenTagsExpressionFromSimpleSyntax(input: string) {
  const { include, exclude } = parseSimpleTagsSyntax(input)

  const parts: string[] = []
  if (include.length) parts.push(`(${include.join(' and ')})`)
  if (exclude.length) parts.push(`not (${exclude.join(' or ')})`)

  return parts.join(' and ')
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
//   console.error('Usage: node e2e/run-e2e.mts <client>')
//   process.exit(1)
// }

// Run bddgen and playwright

try {
  console.log(`Running e2e tests for client: ${clientName}`)

  const tagsExpression = values.tags
    ? buildBddgenTagsExpressionFromSimpleSyntax(String(values.tags))
    : ''

  if (tagsExpression) {
    console.log(`Using tags expression: ${tagsExpression}`)
  }

  // Run bddgen with PLAYWRIGHT_CLIENT environment variable
  const bddgenArgs = [
    bddgenCliPath,
    ...(tagsExpression ? ['--tags', tagsExpression] : []),
  ]
  console.log('executing: ' + formatCommandForLog(process.execPath, bddgenArgs))
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
  console.log('executing: ' + formatCommandForLog(process.execPath, pwArgs))
  console.log(
    'equivalent: ' +
      formatCommandForLog('npx', ['playwright', 'test', ...playwrightArgs])
  )
  execFileSync(process.execPath, pwArgs, {
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_CLIENT: clientName },
  })
} catch (error) {
  // console.error(error)
  const exitCode =
    error && typeof error === 'object' && 'status' in error
      ? (error as { status: number }).status || 1
      : 1
  process.exit(exitCode)
}
