<template>
  <v-card class="layer-chooser-selection">
    <template v-if="backgrounds.length">
      <v-card-title id="polar-label-background-title">{{
        $t('plugins.layerChooser.backgroundTitle')
      }}</v-card-title>
      <v-card-text>
        <v-radio-group v-model="activeBackground" dense hide-details>
          <template v-for="{ name, id } in backgrounds">
            <LayerWrapper
              :key="`background-layer-${id}`"
              :disabled-layers="disabledBackgrounds"
              :layer-id="id"
            >
              <v-radio
                aria-describedby="polar-label-background-title"
                dense
                hide-details
                :label="$t(name)"
                :value="id"
                :disabled="disabledBackgrounds[id]"
                @keydown.up.stop
                @keydown.right.stop
                @keydown.down.stop
                @keydown.left.stop
              ></v-radio>
            </LayerWrapper>
          </template>
        </v-radio-group>
      </v-card-text>
    </template>
    <template v-if="shownMasks.length">
      <template v-for="[type, masks] in Object.entries(masksSeparatedByType)">
        <v-card-title
          :id="`polar-label-${type}-title`"
          :key="`layer-chooser-mask-title-${type}`"
        >
          {{ $t(`plugins.layerChooser.${type}Title`) }}
        </v-card-title>
        <v-card-text :key="`layer-chooser-mask-text-${type}`">
          <template v-for="{ name, id } in masks">
            <LayerWrapper
              :key="`mask-layer-${type}-${id}`"
              :disabled-layers="disabledMasks"
              :layer-id="id"
            >
              <v-checkbox
                v-model="activeMasks"
                :label="$t(name)"
                :value="id"
                :aria-describedby="`polar-label-${type}-title`"
                dense
                hide-details
                class="cut-off-top-space"
                :disabled="disabledMasks[id]"
              />
            </LayerWrapper>
          </template>
        </v-card-text>
      </template>
    </template>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
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
      'masksSeparatedByType',
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
