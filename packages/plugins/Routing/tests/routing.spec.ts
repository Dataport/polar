import { mount } from '@vue/test-utils'
import createTestMountParameters, {
  MockParameters,
} from '@polar/lib-test-mount-parameters'
import { Routing } from '../src/components/index'
import { makeStoreModule } from '../src/store/index'

/**
 * Test suite for the 'plugin-routing' module.
 *
 * This suite includes tests for the Vue component integration and the store functionality
 * within the 'plugin-routing' module.
 */
describe('plugin-routing', () => {
  let testParameters: MockParameters

  beforeEach(() => {
    testParameters = createTestMountParameters()
    // simulates the store creation
    testParameters.store.registerModule(
      ['plugin', 'routing'],
      makeStoreModule()
    )
  })

  /**
   * Test suite for components within the 'plugin-routing' module.
   */
  describe('components', () => {
    it('should define all elements', () => {
      const wrapper = mount(Routing, { ...testParameters }) // simulates the mounting of the routing component
      const vBtn = wrapper.findAllComponents({ name: 'v-btn' })
      expect(vBtn.length).toBe(3)
    })
  })
})
