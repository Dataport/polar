import { Page } from '@playwright/test'

const execute = async (
  page: Page,
  command: string,
  path: string,
  payload: unknown,
  params?: object
) => {
  const evaluatable = `window.mapInstance.$store.${command}('${path}'${
    typeof payload !== 'undefined'
      ? `, ${JSON.stringify(payload)}`
      : typeof params !== 'undefined'
      ? JSON.stringify(null)
      : ''
  }${typeof params !== 'undefined' ? `, ${JSON.stringify(params)}` : ''})`
  console.error(evaluatable)
  await page.evaluate(evaluatable)
}

export const dispatch = async (
  page: Page,
  path: string,
  payload: unknown,
  params?: object
) => await execute(page, 'dispatch', path, payload, params)

export const commit = async (
  page: Page,
  path: string,
  payload: unknown,
  params?: object
) => await execute(page, 'commit', path, payload, params)
