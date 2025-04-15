import createTestMountParameters, {
  MockParameters,
} from '@polar/lib-test-mount-parameters'
import { mount } from '@vue/test-utils'
import { LayerChooser } from '../src/components/index'
import { makeStoreModule } from '../src/store/index'

describe('plugin-layerchooser', () => {
  let testParameters: MockParameters

  beforeEach(() => {
    testParameters = createTestMountParameters()
    testParameters.store.registerModule(
      ['plugin', 'layerChooser'],
      makeStoreModule()
    )
  })

  describe('components', () => {
    it("doesn't render empty selections", () => {
      const wrapper = mount(LayerChooser, { ...testParameters })
      const vCard = wrapper.findAllComponents({ name: 'v-card' })
      const vCardTitle = wrapper.findAllComponents({ name: 'v-card-title' })
      const vCardText = wrapper.findAllComponents({ name: 'v-card-text' })
      expect(vCard.length).toBe(1)
      expect(vCardTitle.length).toBe(0)
      expect(vCardText.length).toBe(0)
    })

    it('renders selections with available values', () => {
      testParameters.store.commit('plugin/layerChooser/setBackgrounds', [
        { id: 'eins', name: 'oneth', type: 'background' },
      ])
      testParameters.store.commit('plugin/layerChooser/setMasks', [
        { id: 'null', name: 'nulleth', type: 'mask' },
      ])

      const wrapper = mount(LayerChooser, { ...testParameters })
      const vCard = wrapper.findAllComponents({ name: 'v-card' })
      const vCardTitle = wrapper.findAllComponents({ name: 'v-card-title' })
      const vCardText = wrapper.findAllComponents({ name: 'v-card-text' })
      expect(vCard.length).toBe(1)
      expect(vCardTitle.length).toBe(2)
      expect(vCardText.length).toBe(2)
    })
  })
})
