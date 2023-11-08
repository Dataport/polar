import { mount } from '@vue/test-utils'
import createTestMountParameters, {
  MockParameters,
} from '@polar/lib-test-mount-parameters'
import { GeoLocation } from '../src/components/index'
import GeoLocationStore from '../src/store/index'

describe('plugin-geolocation', () => {
  let testParameters: MockParameters

  beforeEach(() => {
    testParameters = createTestMountParameters()
    testParameters.store.registerModule(
      ['plugin', 'geoLocation'],
      GeoLocationStore
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
