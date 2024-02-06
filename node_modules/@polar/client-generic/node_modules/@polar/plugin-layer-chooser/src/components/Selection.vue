<template>
  <v-card class="layer-chooser-selection">
    <v-card-title v-if="backgrounds.length" id="polar-label-background-title">{{
      $t('common:plugins.layerChooser.backgroundTitle')
    }}</v-card-title>
    <v-card-text v-if="backgrounds.length">
      <v-radio-group v-model="activeBackground" dense hide-details>
        <template v-for="({ name, id }, index) in backgrounds">
          <LayerWrapper
            :key="'disabled-background-' + index"
            :index="index"
            :disabled-layers="disabledBackgrounds"
            :layer-id="id"
          >
            <v-radio
              :key="index"
              aria-describedby="polar-label-background-title"
              dense
              hide-details
              :label="$t(name)"
              :value="id"
              :disabled="disabledBackgrounds[index]"
            ></v-radio>
          </LayerWrapper>
        </template>
      </v-radio-group>
    </v-card-text>
    <v-card-title v-if="shownMasks.length" id="polar-label-mask-title">{{
      $t('common:plugins.layerChooser.maskTitle')
    }}</v-card-title>
    <v-card-text v-if="shownMasks.length">
      <template v-for="({ name, id }, index) in shownMasks">
        <LayerWrapper
          :key="'disabled-mask-' + index"
          :index="index"
          :disabled-layers="disabledMasks"
          :layer-id="id"
        >
          <v-checkbox
            v-model="activeMasks"
            :label="$t(name)"
            :value="id"
            aria-describedby="polar-label-mask-title"
            dense
            hide-details
            class="cut-off-top-space"
            :disabled="disabledMasks[index]"
          />
        </LayerWrapper>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import LayerWrapper from './LayerWrapper.vue'

export default Vue.extend({
  name: 'LayerChooserSelection',
  components: { LayerWrapper },
  computed: {
    ...mapGetters('plugin/layerChooser', [
      'activeBackgroundId',
      'activeMaskIds',
      'backgrounds',
      'disabledBackgrounds',
      'disabledMasks',
      'shownMasks',
    ]),
    activeBackground: {
      get() {
        return this.activeBackgroundId
      },
      set(value) {
        this.setActiveBackgroundId(value)
      },
    },
    activeMasks: {
      get() {
        return this.activeMaskIds
      },
      set(value) {
        this.setActiveMaskIds(value)
      },
    },
  },
  methods: {
    ...mapActions('plugin/layerChooser', [
      'setActiveBackgroundId',
      'setActiveMaskIds',
    ]),
  },
})
</script>

<style lang="scss" scoped>
.layer-chooser-selection {
  display: flex;
  flex-direction: column;
  max-width: inherit;
  white-space: nowrap;

  .v-card__title {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 100%;
  }

  .v-card__text {
    padding-bottom: 8px;
  }

  .v-input--radio-group {
    margin-top: 0;
    padding-top: 0;
  }

  .v-radio {
    margin-bottom: 0 !important;
  }

  .cut-off-top-space {
    margin-top: 0;
    padding-top: 0;
  }
}
</style>
