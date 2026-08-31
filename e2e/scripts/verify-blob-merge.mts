#!/usr/bin/env node

/* eslint-disable no-console */

import { cp, mkdir, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const smokeTags = '@smoke and not (@not_implemented or @fails)'
const defaultClients = ['snowbox', 'dish']

const parseClients = () => {
  const envClients = process.env.E2E_CLIENTS
  if (!envClients) return defaultClients

  const clients = envClients
    .split(',')
    .map((client) => client.trim())
    .filter(Boolean)

  return clients.length ? clients : defaultClients
}

const npmCliPath = process.env.npm_execpath

const run = (command: string, args: string[]) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false,
  })

  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const runNpm = (args: string[]) => {
  if (npmCliPath) {
    run(process.execPath, [npmCliPath, ...args])
    return
  }

  run('npm', args)
}

const main = async () => {
  const clients = parseClients()

  console.log(
    `Verifying Playwright blob merge for clients: ${clients.join(', ')}`
  )

  await rm('blob-report', { recursive: true, force: true })
  await rm('all-blob-reports', { recursive: true, force: true })
  await rm('playwright-report', { recursive: true, force: true })
  await mkdir('all-blob-reports', { recursive: true })

  for (const client of clients) {
    console.log(`\n=== ${client}: build ===`)
    runNpm(['run', `${client}:build`])

    console.log(`\n=== ${client}: smoke e2e ===`)
    runNpm([
      'run',
      `test:e2e:${client}`,
      '--',
      '--tags',
      smokeTags,
      '--pass-with-no-tests',
    ])

    console.log(`\n=== ${client}: save blob report ===`)
    await cp('blob-report/report.zip', `all-blob-reports/report-${client}.zip`)
    await rm('blob-report', { recursive: true, force: true })
  }

  console.log('\n=== Merge reports ===')
  runNpm([
    'exec',
    '--',
    'playwright',
    'merge-reports',
    '--reporter',
    'html',
    'all-blob-reports',
  ])

  console.log('\nMerged report available in playwright-report/')
  console.log('Open it with: npx playwright show-report playwright-report')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
