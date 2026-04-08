/**
 * Manages the lifecycle of a single mock map server instance for the test process.
 * This singleton wrapper centralizes start and stop logic.
 */

import type { Server } from 'node:http'
import { createMockMapServer } from './server'

const DEFAULT_PORT = 3579
const DEFAULT_HOST = '127.0.0.1'

// eslint-disable-next-line no-use-before-define
type ManagerInstance = MockMapServerManager | null

export class MockMapServerManager {
  private static instance: ManagerInstance = null

  private server: Server | null = null
  private port: number
  private host: string
  private running = false

  private constructor(port?: number, host?: string) {
    this.port = port ?? DEFAULT_PORT
    this.host = host ?? DEFAULT_HOST
  }

  /**
   * Returns the singleton manager instance, creating it on first access.
   * Optional host and port values are applied only during initial construction.
   *
   * @param port - Optional TCP port used by the managed mock server instance.
   * @param host - Optional host interface used by the managed mock server instance.
   * @returns The shared `MockMapServerManager` instance.
   */
  static getInstance(port?: number, host?: string): MockMapServerManager {
    if (!MockMapServerManager.instance) {
      MockMapServerManager.instance = new MockMapServerManager(port, host)
    }
    return MockMapServerManager.instance
  }

  /**
   * Clears the stored singleton reference so a new manager can be created later.
   * This is mainly useful for tests that validate manager behavior in isolation.
   */
  static resetInstance(): void {
    MockMapServerManager.instance = null
  }

  /**
   * Starts the mock server and resolves when it is ready to accept requests.
   * If the server is already running, this method returns immediately.
   */
  start(): Promise<void> {
    if (this.running) {
      // eslint-disable-next-line no-console
      console.log(
        `[MockMapServer] Already running on ${this.host}:${this.port}`
      )
      return Promise.resolve()
    }

    this.server = createMockMapServer()
    const server = this.server

    return new Promise<void>((resolve, reject) => {
      server.on('error', (err: Error & { code?: string }) => {
        if (err.code === 'EADDRINUSE') {
          // eslint-disable-next-line no-console
          console.warn(
            `[MockMapServer] Port ${this.port} in use — assuming server is already running.`
          )
          this.running = true
          resolve()
        } else {
          reject(err)
        }
      })

      server.listen(this.port, this.host, () => {
        this.running = true
        // eslint-disable-next-line no-console
        console.log(`[MockMapServer] Listening on ${this.host}:${this.port}`)
        resolve()
      })
    })
  }

  /**
   * Stops the running mock server and releases the internal server reference.
   * If no server is active, this method resolves without doing anything.
   */
  stop(): Promise<void> {
    if (!this.running || !this.server) {
      return Promise.resolve()
    }

    const server = this.server
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err)
        } else {
          this.running = false
          this.server = null
          // eslint-disable-next-line no-console
          console.log('[MockMapServer] Stopped.')
          resolve()
        }
      })
    })
  }

  /**
   * Builds the base URL used by test clients to reach the mock server.
   *
   * @returns The HTTP base URL including host and port.
   */
  getBaseUrl(): string {
    return `http://${this.host}:${this.port}`
  }

  /**
   * Reports whether the manager currently considers the server running.
   *
   * @returns `true` when the server has been started and not yet stopped.
   */
  isRunning(): boolean {
    return this.running
  }

  /**
   * Returns the configured port for the managed mock server.
   *
   * @returns The TCP port number used for server listen operations.
   */
  getPort(): number {
    return this.port
  }
}
