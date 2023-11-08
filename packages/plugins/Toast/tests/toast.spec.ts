import { mount } from '@vue/test-utils'
import createTestMountParameters from '@polar/lib-test-mount-parameters'
import ToastStore from '../src/store'
import { Toast as ToastComponent } from '../src/components'
import { Toast, ToastState } from '../src/types'

const toasts: Toast[] = [
  { type: 'success', text: 'Tiles have been glued.' },
  { type: 'info', text: "Tiles weren't supposed to be glued." },
  { type: 'warning', text: "Can't get the tiles off now." },
  { type: 'error', text: "It's possible that you may have a problem." },
]

describe('plugin-toast', () => {
  describe('components', () => {
    let testParameters

    beforeEach(() => {
      testParameters = createTestMountParameters()
      testParameters.store.registerModule(['plugin', 'toast'], ToastStore)
    })

    it('should render the toasts with text/type as specified', () => {
      ;(ToastStore.state as ToastState).toasts = toasts

      const wrapper = mount(ToastComponent, { ...testParameters })
      const alerts = wrapper.findAllComponents({ name: 'v-alert' })

      toasts.forEach((toast, index) => {
        const alert = alerts.at(index)
        expect(alert.text()).toBe(toast.text)
        expect(alert.classes(toast.type)).toBe(true)
      })
    })
  })
})
