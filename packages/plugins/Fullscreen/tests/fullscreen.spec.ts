import createTestMountParameters from '@polar/lib-test-mount-parameters'
import { mount } from '@vue/test-utils'
import { Fullscreen as FullscreenComponent } from '../src/components'
import { makeStoreModule } from '../src/store'

describe('plugin-fullscreen', () => {
  describe('components', () => {
    let testParameters

    beforeEach(() => {
      testParameters = createTestMountParameters()
      testParameters.store.registerModule(
        ['plugin', 'fullscreen'],
        makeStoreModule()
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
