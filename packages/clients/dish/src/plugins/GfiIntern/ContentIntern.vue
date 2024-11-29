<template>
  <v-card v-if="showGfi" class="dish-gfi-content">
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
      <ActionButton></ActionButton>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        :aria-label="$t('common:plugins.gfi.header.close')"
        @click="close(true)"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <MonumentContent></MonumentContent>
    <div id="dish-gfi-switch-buttons">
      <SwitchButtonIntern v-if="showDishSwitchButtons"></SwitchButtonIntern>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import ActionButton from '../Gfi/ActionButton.vue'
import { denkmaelerWmsIntern } from '../../servicesIntern'
import { alkisWms } from '../../services'
import SwitchButtonIntern from './SwitchButtonIntern.vue'
import MonumentContent from './MonumentContent.vue'

export default Vue.extend({
  name: 'DishGfiIntern',
  components: {
    ActionButton,
    SwitchButtonIntern,
    MonumentContent,
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', ['currentProperties', 'windowFeatures']),
    ...mapGetters('plugin/layerChooser', ['activeMaskIds']),
    objektIdentifier(): string {
      return this.currentProperties.objektid
    },
    showDishSwitchButtons(): boolean {
      if (
        this.showInfoForActiveLayers('alkis') &&
        !this.showInfoForActiveLayers('monument')
      ) {
        return false
      }
      return this.windowFeatures.length > 2
    },
    showGfi(): boolean {
      return (
        (this.showInfoForActiveLayers('monument') && this.objektIdentifier) ||
        this.showInfoForActiveLayers('alkis')
      )
    },
  },
  watch: {
    windowFeatures() {
      this.setVisibleWindowFeatureIndex(0)
    },
  },
  mounted() {
    if (this.hasWindowSize && this.hasSmallWidth) {
      this.setMoveHandleActionButton({
        component: ActionButton,
      })
    }
  },
  beforeDestroy() {
    this.setMoveHandleActionButton(null)
  },
  methods: {
    ...mapMutations(['setMoveHandleActionButton']),
    ...mapMutations('plugin/gfi', ['setVisibleWindowFeatureIndex']),
    ...mapActions('plugin/gfi', ['close']),
    showInfoForActiveLayers(topic: 'alkis' | 'monument') {
      const layerMap = {
        alkis: alkisWms,
        monument: denkmaelerWmsIntern,
      }
      const targetLayer = layerMap[topic]
      return targetLayer ? this.activeMaskIds.includes(targetLayer) : false
    },
  },
})
</script>

<style lang="scss" scoped></style>
