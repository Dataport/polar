<template>
  <div
    id="polar-plugin-scales"
    :title="$t('common:plugins.scale.label')"
    :aria-label="$t('common:plugins.scale.label')"
  >
    <select
      v-if="scales.length > 0"
      v-model="scale"
      class="scale-as-a-ratio"
      @change="setResolutionByIndex($event.target.selectedIndex)"
    >
      <option v-for="(scaleOption, i) in scales" :key="i" :value="scaleOption">
        {{ scalesToOne(scaleOption.scale) }}
      </option>
    </select>
    <span v-else class="scale-as-a-ratio">
      {{ scaleToOne }}
    </span>
    <span class="scale-line">
      {{ scaleWithUnit }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { mapConfiguration } from '../../../../clients/dish/src/mapConfig'
import thousandsSeparator from '../utils/thousandsSeperator'

export default Vue.extend({
  name: 'PolarScale',
  data() {
    return {
      scales: [] as { scale: number; zoomLevel: number }[],
    }
  },
  computed: {
    ...mapGetters({
      scaleToOne: 'plugin/scale/scaleToOne',
      scaleValue: 'plugin/scale/scaleValue',
      scaleWithUnit: 'plugin/scale/scaleWithUnit',
      getMapView: 'map/getMapView',
    }),
    scalesToOne() {
      return (scale: number) => '1 : ' + thousandsSeparator(scale)
    },
    scale: {
      get() {
        let scaleToCompare = this.scaleValue

        if (scaleToCompare > 10000) {
          scaleToCompare = Math.round(scaleToCompare / 500) * 500
        } else if (scaleToCompare > 1000) {
          scaleToCompare = Math.round(scaleToCompare / 50) * 50
        }
        return this.scales[
          this.scales.findIndex((s) => s.scale === scaleToCompare)
        ]
      },
      set(value: number) {
        this.setScaleValue(value)
      },
    },
  },
  created() {
    this.scales = mapConfiguration.options.map((option) => ({
      scale: option.scale,
      zoomLevel: option.zoomLevel,
    }))
  },
  methods: {
    ...mapMutations({
      setScaleValue: 'plugin/scale/setScaleValue',
    }),
    ...mapActions({
      setZoomLevel: 'plugin/zoom/setZoomLevel',
    }),
    setResolutionByIndex(index: number) {
      this.setZoomLevel(this.scales[index].zoomLevel)
    },
  },
})
</script>

<style lang="scss">
#polar-plugin-scales {
  display: flex;
  flex-direction: row;

  text-align: center;
  font-size: 14px;
  gap: 4px;
  margin: 4px;

  > span,
  > select {
    background: #ffffffcc;
    border-radius: 2px;
    border-width: 0 2px 2px 2px;
    border-style: solid;
  }

  .scale-line {
    display: inline-block;
    border-color: black;

    width: 2cm;
  }

  .scale-as-a-ratio {
    display: inline-block;
    white-space: nowrap;
    /* keeping border so texts align well */
    border-color: transparent;

    padding-left: 1em;
    padding-right: 1em;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: flex-end;
  }
}
</style>
