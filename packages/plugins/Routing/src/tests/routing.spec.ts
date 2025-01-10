import { mount } from '@vue/test-utils'
import createTestMountParameters, {
  MockParameters,
} from '@polar/lib-test-mount-parameters'
import { Routing } from '../components/index'
import { makeStoreModule } from '../store/index'

describe('plugin-routing', () => {
  let testParameters: MockParameters

  beforeEach(() => {
    testParameters = createTestMountParameters()
    // täuscht die Erstellung des Stores vor
    testParameters.store.registerModule(
      ['plugin', 'routing'],
      makeStoreModule()
    )
  })

  describe('components', () => {
    it('should define all elements', () => {
      const wrapper = mount(Routing, { ...testParameters }) // hier wird das mounten des Routing components vorgetäuscht
      const vBtn = wrapper.findAllComponents({ name: 'v-btn' })
      expect(vBtn.length).toBe(3)
    })
  })
})
