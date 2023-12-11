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

    it("should'nt render the fullscreen button when no fullscreen method is available", () => {
      const wrapper = mount(FullscreenComponent, { ...testParameters })
      const tooltip = wrapper.findAllComponents({ name: 'v-tooltip' })
      const button = wrapper.findAllComponents({ name: 'v-btn' })

      expect(tooltip.length).toBe(0)
      expect(button.length).toBe(0)
    })
  })
})
