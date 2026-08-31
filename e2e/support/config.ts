/**
 * Shared test configuration values.
 *
 * Centralizes environment-derived config so step definitions and fixtures read
 * from a single source instead of re-deriving it from `process.env` inline.
 */

/** Base URL of the mock map server used by the `mockMap` fixture. */
export const MOCK_MAP_BASE_URL =
  process.env.MOCK_MAP_URL ?? 'http://127.0.0.1:3579'
