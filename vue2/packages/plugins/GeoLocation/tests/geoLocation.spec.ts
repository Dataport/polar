import { mount } from '@vue/test-utils'
import createTestMountParameters, {
  MockParameters,
} from '@polar/lib-test-mount-parameters'
import { GeoLocation } from '../src/components/index'
import { makeStoreModule } from '../src/store/index'

describe('plugin-geolocation', () => {
  let testParameters: MockParameters

  beforeEach(() => {
    testParameters = createTestMountParameters()
    testParameters.store.registerModule(
      ['plugin', 'geoLocation'],
      makeStoreModule()
    )
  })

  describe('components', () => {
    it('should define all elements', () => {
      const wrapper = mount(GeoLocation, { ...testParameters })
      const vBtn = wrapper.findAllComponents({ name: 'v-btn' })
      expect(vBtn.length).toBe(1)
    })
  })
})
