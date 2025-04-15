import { expect, test } from '@playwright/test'
import { openSnowbox } from './utils/openSnowbox'
import { dispatch } from './utils/vuex'

const locatable = '私が来た'

test('programmatically dispatched toasts are visible in the UI', async ({
  page,
}) => {
  await openSnowbox(page)

  await dispatch(page, 'plugin/toast/addToast', {
    type: 'info',
    text: locatable,
  })

  await expect(page.getByText(locatable)).toBeVisible()
})
