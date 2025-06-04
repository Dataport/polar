import { mount } from '@vue/test-utils'
import createTestMountParameters, {
  MockParameters,
} from '@polar/lib-test-mount-parameters'
import Zoom from '../../src/components/Zoom.vue'
import { makeStoreModule } from '../../src/store/index'

describe('zoom-test', () => {
  let testParameters: MockParameters

  beforeEach(() => {
    testParameters = createTestMountParameters()
    testParameters.store.registerModule(['plugin', 'zoom'], makeStoreModule())
  })

  test('should feature a zoom-in and a zoom-out v-btn', () => {
    const wrapper = mount(Zoom, { ...testParameters })
    const buttons = wrapper.findAllComponents({ name: 'v-btn' })
    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).html()).toContain('fa-plus')
    expect(buttons.at(1).html()).toContain('fa-minus')
  })
})
