import { mount } from '@vue/test-utils'
import createTestMountParameters from '@polar/lib-test-mount-parameters'
import FullscreenStore from '../src/store'
import { Fullscreen as FullscreenComponent } from '../src/components'

describe('plugin-fullscreen', () => {
  describe('components', () => {
    let testParameters

    beforeEach(() => {
      testParameters = createTestMountParameters()
      testParameters.store.registerModule(
        ['plugin', 'fullscreen'],
        FullscreenStore
      )
    })

    it('should render the fullscreen button', () => {
      const wrapper = mount(FullscreenComponent, { ...testParameters })
      const tooltip = wrapper.findAllComponents({ name: 'v-tooltip' })
      const button = wrapper.findAllComponents({ name: 'v-btn' })

      expect(tooltip.length).toBe(1)
      expect(button.length).toBe(1)
    })
  })
})
