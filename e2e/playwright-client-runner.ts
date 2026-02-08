/**
 * Playwright Client Runner
 * This script is responsible for handling the lifecycle of clients used in Playwright tests.
 * It builds the clients, serves them, and manages their lifecycle concurrently.
 */

import { parseArgs } from 'node:util'
import { ChildProcess, exec, spawn } from 'child_process'
import { readdirSync, readFileSync, statSync } from 'fs'
import * as path from 'path'
import { get } from 'http'
import { Logger, ILogObj } from 'tslog'

const LOG: Logger<ILogObj> = new Logger({ name: 'PlaywrightClientRunner' })

const BUILD_MODES = ['skip', 'parallel', 'sequential'] as const
/**
 * Defines the build modes for the clients.
 * - 'skip': Do not build the clients, assume they are already built.
 * - 'parallel': Build the clients in parallel.
 * - 'sequential': Build the clients sequentially.
 */
export type BuildMode = (typeof BUILD_MODES)[number]

/**
 * Represents a client with its name, package name, directory, and port.
 * The port is initially set to null and will be updated when the server starts.
 */
export interface Client {
  name: string
  packageName: string
  directory: string
  port: number | null
}

/**
 * Represents a running client with its associated server process.
 * It includes a method to close the server process.
 */
export interface RunningClient {
  client: Client
  serverProcess: ChildProcess
  close: () => void
}

const { values } = parseArgs({
  options: {
    clients: {
      type: 'string',
      short: 'c',
      multiple: true,
      default: [],
    },
    buildMode: {
      type: 'string',
      short: 'b',
      choices: BUILD_MODES,
      default: 'sequential',
    },
  },
})

/** Array to hold currently running clients. */
let runningClients: RunningClient[] = []

/**
 * Closes all running clients by terminating their server processes.
 * It logs the closure of each client and clears the runningClients array.
 */
function closeRunningClients() {
  LOG.info('Closing all running clients...')
  runningClients.forEach((client) => {
    client.close()
  })
  runningClients = []
  LOG.info('All clients closed.')
}

/**
 * Function reads the 'packages/clients' directory and returns an array with the clients to run.
 *
 * @returns Array of Client objects containing the name, package name, directory, and port (initially null).
 */
function getClients(): Client[] {
  const clientsPath = path.resolve(__dirname, '../packages/clients')
  const clientDirs = readdirSync(clientsPath).filter((fileName) =>
    // filter out non-directory files
    statSync(path.join(clientsPath, fileName)).isDirectory()
  )

  return clientDirs.map((clientName) => {
    // Extract the client name from the package name
    const packagePath = path.resolve(clientsPath, clientName, 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))

    return {
      name: clientName,
      packageName: packageJson.name,
      directory: path.join(clientsPath, clientName),
      port: null,
    }
  })
}

/**
 * Builds the client using 'npm run <clientName>:build'.
 *
 * @param client Client object containing the client information.
 * @returns Promise that resolves when the build is complete.
 */
function buildClient(client: Client): Promise<void> {
  return new Promise((resolve, reject) => {
    LOG.info(`Building client ${client.packageName}...`)
    const buildProcess = spawn('npm', ['run', `${client.name}:build`], {
      shell: true,
    })

    buildProcess.on('exit', (code) => {
      if (code === 0) {
        LOG.info(`Client ${client.packageName} built successfully.`)
        resolve()
      } else {
        LOG.error(
          `Failed to build client ${client.packageName} with exit code ${code}`
        )
        reject(new Error(`Build failed for client ${client.packageName}`))
      }
    })
  })
}

/**
 * Extracts the port number from the server output text.
 * Assumes the output contains a line like "http://127.0.0.1:<port>"
 */
function extractPort(text: string): number | null {
  const portRegex = /http:\/\/127\.0\.0\.1:(\d+)/
  const portMatch = text.match(portRegex)
  return portMatch ? parseInt(portMatch[1]) : null
}

/**
 * Serves the client inside a child process using `http-server`.
 *
 * @param client Client object containing the client information.
 * @returns RunningClient object containing the client, server process, and a close function.
 */
function serveClient(client: Client): RunningClient {
  LOG.info(`Serving client ${client.packageName}`)
  const serverProcess = spawn(
    'npx',
    ['http-server', `./packages/clients/${client.name}`],
    {
      shell: true,
    }
  )

  // Handle server port number extraction from stdout
  const onData = (data: Buffer) => {
    const port = extractPort(data.toString())
    if (port) {
      LOG.info(`Client ${client.packageName} is running on port ${port}`)
      // Update the client port
      client.port = port
      // Remove listener after port is set
      serverProcess.stdout?.removeListener('data', onData)
    }
  }
  serverProcess.stdout?.on('data', onData)

  const close = () => {
    LOG.info(`Closing server for client ${client.packageName}`)
    serverProcess.kill()
  }

  return {
    client,
    serverProcess,
    close,
  }
}

/**
 * Waits for the server to start by checking if it responds to HTTP requests.
 *
 * @param client Client object containing the client information.
 * @param timeout Maximum time to wait for the server to start (default is 20000ms).
 * @returns Promise that resolves when the server is ready or rejects on timeout.
 */
function waitForServer(client: Client, timeout = 60000): Promise<void> {
  const startTime = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      if (!client.port) {
        retry()
        return
      }
      get(`http://localhost:${client.port}`, (res) => {
        if (res.statusCode && res.statusCode < 500) {
          resolve()
        } else {
          LOG.warn(
            `Client ${client.packageName} not ready yet, status code: ${res.statusCode}`
          )
          retry()
        }
      }).on('error', retry)
    }

    const retry = () => {
      if (Date.now() - startTime < timeout) {
        setTimeout(check, 1000)
      } else {
        reject(
          new Error(
            `Server on port ${client.port} did not start within ${timeout}ms`
          )
        )
      }
    }

    check()
  })
}

/**
 * Starts the client server and waits for it to be ready.
 *
 * @param client Client object containing the client information.
 * @returns Promise that resolves to a RunningClient object when the server is ready.
 * @throws Error if the server fails to start or is not ready within the timeout.
 */
async function startAndWaitForClient(client: Client): Promise<RunningClient> {
  const runningClient = serveClient(client)
  try {
    await waitForServer(client)
    LOG.info(`Client ${client.packageName} is ready on port ${client.port}`)
    return runningClient
  } catch (error) {
    LOG.error(`Error starting client ${client.packageName}:`, error)
    runningClient.close()
    throw error
  }
}

/**
 * Temporary fix for building clients.
 * For some reason, building clients might fail and leave the build directory in an inconsistent state.
 * This function shuts down the nx deamon and clears the build cache.
 *
 * TODO: Remove this function when the underlying issue is resolved.
 */
function fixBuildIssues() {
  LOG.info('Fixing Nx build issues...')
  LOG.warn(
    'This is a temporary fix, remove this function when the underlying issue is resolved.'
  )
  return new Promise<void>((resolve, reject) => {
    exec('npx nx reset', (error) => {
      if (error) {
        LOG.error(`Error resetting Nx: ${error.message}`)
        reject(error)
      } else {
        LOG.info('Nx reset completed successfully.')
        resolve()
      }
    })
  })
}

/**
 * Builds and serves the clients concurrently.
 *
 * @param clients Array of Client objects to build and serve.
 * @returns Promise that resolves to an array of RunningClient objects.
 */
async function buildAndServeClients(
  clients: Client[],
  buildMode: BuildMode
): Promise<RunningClient[]> {
  let results: PromiseSettledResult<RunningClient | null>[] = []

  if (buildMode === 'skip') {
    LOG.info('Skipping build, assuming clients are already built.')
    results = await Promise.allSettled(
      clients.map(async (client) => {
        try {
          const running = await startAndWaitForClient(client)
          return running
        } catch (error) {
          LOG.error(`Error serving client ${client.packageName}:`, error)
          return null
        }
      })
    )
  } else if (buildMode === 'parallel') {
    try {
      await fixBuildIssues()
    } catch (error) {
      LOG.error('Error fixing build issues:', error)
      throw new Error(
        'Failed to fix build issues, cannot proceed with starting clients.'
      )
    }
    LOG.info('Building clients in parallel...')
    results = await Promise.allSettled(
      clients.map(async (client) => {
        try {
          await buildClient(client)
          const running = await startAndWaitForClient(client)
          return running
        } catch (error) {
          LOG.error(
            `Error building or serving client ${client.packageName}:`,
            error
          )
          return null
        }
      })
    )
  } else if (buildMode === 'sequential') {
    LOG.info('Building clients sequentially...')
    results = []
    for (const client of clients) {
      try {
        await buildClient(client)
        const running = await startAndWaitForClient(client)
        results.push({ status: 'fulfilled', value: running })
      } catch (error) {
        LOG.error(
          `Error building or serving client ${client.packageName}:`,
          error
        )
        results.push({ status: 'rejected', reason: error })
      }
    }
  } else {
    throw new Error(`Invalid build mode: ${buildMode}`)
  }

  const runningClients = results
    .filter(
      (result): result is PromiseFulfilledResult<RunningClient> =>
        result.status === 'fulfilled' && result.value !== null
    )
    .map((result) => result.value)

  LOG.info(
    `[${runningClients.length}/${clients.length}] clients successfully started .`
  )

  return runningClients
}

/**
 * Prints the currently running clients to the console.
 */
function printRunningClients() {
  const logText = ['Currently running clients:']
  runningClients.forEach((runningClient, index) => {
    logText.push(
      `\t${index + 1}. ${runningClient.client.name} (Package: ${
        runningClient.client.packageName
      }, Port: ${runningClient.client.port})`
    )
  })
  LOG.info(logText.join('\n'))
}

/**
 * Filters the clients based on the provided command line arguments.
 *
 * @param clients clients to filter.
 * @returns clients that match the provided arguments or all clients if no arguments are provided.
 * @throws Error if no clients match the provided arguments.
 */
function filterClientsByArgs(
  clients: Client[],
  clientSelection: string[]
): Client[] {
  if (clientSelection.length === 0) {
    return clients // No args, return all clients
  }
  const filteredClients = clients.filter(
    (client) =>
      clientSelection.includes(client.name) ||
      clientSelection.includes(client.packageName)
  )
  if (filteredClients.length === 0) {
    throw new Error(
      `No clients matched the provided arguments: ${clientSelection.join(', ')}`
    )
  }
  return filteredClients
}

/**
 * Starts test clients, if no selection is provided it starts all clients.
 * @param clientSelection Array of client names or package names to filter the clients.
 * @returns Promise that resolves to an array of RunningClient objects.
 */
export async function startTestClients(
  clientSelection: string[] = [],
  buildMode: BuildMode = 'sequential'
): Promise<RunningClient[]> {
  const clients = getClients()
  const filteredClients = filterClientsByArgs(clients, clientSelection)
  runningClients = await buildAndServeClients(filteredClients, buildMode)
  if (runningClients.length === 0) {
    throw new Error('No clients were started successfully.')
  }
  LOG.info('Finished starting clients')
  printRunningClients()
  return runningClients
}

/**
 * Stops all running test clients by closing the child processes they are using.
 */
export function stopTestClients() {
  closeRunningClients()
}

if (require.main === module) {
  // Handle graceful shutdown
  ;['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) => {
    process.on(signal, () => {
      LOG.warn(`Received ${signal}, closing all clients...`)
      closeRunningClients()
      process.exit(0)
    })
  })

  // Start the test clients and print the running clients
  startTestClients(values.clients, values.buildMode as BuildMode).catch(
    (error) => {
      LOG.error('Error while starting test clients:', error)
      closeRunningClients()
      process.exit(1)
    }
  )
}
