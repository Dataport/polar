// it is what it is – a test file, specifically
/* eslint-disable max-lines-per-function */
import { test } from '@playwright/test'
import { draw } from '../../../../e2e/utils/draw'
import { openDiPlan } from './utils/openDiplan'

const drawTargetId = 'subscribed-draw'

test('drawn polygons can be cut', async ({ page }) => {
  await openDiPlan(page)

  await page.getByLabel('Digitalisierungswerkzeuge').click()
  await page.getByLabel('Neue Fläche einzeichnen').click()

  await draw(page, [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'click'],
    [-40, 40, 'dblclick'],
  ])

  await page.getByLabel('Durchschneiden').click()

  await draw(page, [
    [-80, 0, 'click'],
    [160, 0, 'dblclick'],
  ])

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 2,
    drawTargetId,
    { timeout: 5000 }
  )
})

test('drawn polygons can be duplicated', async ({ page }) => {
  await openDiPlan(page)

  await page.getByLabel('Digitalisierungswerkzeuge').click()
  await page.getByLabel('Neue Fläche einzeichnen').click()

  await draw(page, [
    [-40, 0, 'click'],
    [40, -40, 'click'],
    [40, 40, 'dblclick'],
  ])

  await page.getByLabel('Duplizieren').click()

  await draw(page, [[0, -20, 'click']])

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 2,
    drawTargetId,
    { timeout: 5000 }
  )
})

test('drawn polygons can be merged', async ({ page }) => {
  await openDiPlan(page)

  await page.getByLabel('Digitalisierungswerkzeuge').click()
  await page.getByLabel('Neue Fläche einzeichnen').click()

  await draw(page, [
    [-40, 0, 'click'],
    [0, -40, 'click'],
    [-40, 40, 'dblclick'],
  ])

  await draw(page, [
    [40, 0, 'click'],
    [40, 0, 'click'],
    [-40, -40, 'dblclick'],
  ])

  await page.getByLabel('Flächen kombinieren').click()

  await draw(page, [
    [60, -20, 'click'],
    [-120, 0, 'click'],
    [0, 40, 'click'],
    [120, 0, 'dblclick'],
  ])

  await page.waitForFunction(
    (id) =>
      document.getElementById(id)?.innerText !== 'uninitialized' &&
      JSON.parse(document.getElementById(id)?.innerText || '').features
        .length === 1,
    drawTargetId,
    { timeout: 5000 }
  )
})
