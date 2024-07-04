<template>
  <div
    id="polar-plugin-scales"
    :title="$t('common:plugins.scale.label')"
    :aria-label="$t('common:plugins.scale.label')"
  >
    <select
      v-if="showSelectOptions"
      v-model="scale"
      :title="$t('common:plugins.scale.scaleSwitcher')"
      :aria-label="$t('common:plugins.scale.scaleSwitcher')"
      class="scale-as-a-ratio scale-switcher"
      @change="setZoomLevelByScale($event.target.selectedIndex)"
    >
      <option
        v-for="(option, i) in zoomOptions"
        :key="i"
        :value="option"
        class="scale-as-a-ratio"
      >
        {{ scaleNumberToScale(option.scale) }}
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
import thousandsSeparator from '../utils/thousandsSeperator'
import beautifyScale from '../utils/beautifyScale'

export default Vue.extend({
  name: 'PolarScale',
  computed: {
    ...mapGetters({
      zoomOptions: 'plugin/scale/zoomOptions',
      scaleToOne: 'plugin/scale/scaleToOne',
      scaleValue: 'plugin/scale/scaleValue',
      scaleWithUnit: 'plugin/scale/scaleWithUnit',
      getMapView: 'map/getMapView',
    }),
    scaleNumberToScale() {
      return (scale: number) => {
        return '1 : ' + thousandsSeparator(scale)
      }
    },
    scale: {
      get() {
        const scaleToCompare = beautifyScale(this.scaleValue)

        return this.zoomOptions[
          this.zoomOptions.findIndex((s) => s.scale === scaleToCompare)
        ]
      },
      set(value: number) {
        this.setScaleValue(value)
      },
    },
    showSelectOptions() {
      return this.zoomOptions.length > 0
    },
  },
  methods: {
    ...mapMutations({
      setScaleValue: 'plugin/scale/setScaleValue',
    }),
    ...mapActions({
      setZoomLevel: 'plugin/zoom/setZoomLevel',
    }),
    setZoomLevelByScale(index: number) {
      this.setZoomLevel(this.zoomOptions[index].zoomLevel)
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

  .scale-switcher:hover {
    cursor: pointer;
    font-weight: bold;
    background: #003064;
    color: #ffffff;
  }

  .scale-switcher option {
    cursor: pointer;
    font-weight: normal;
    background: #ffffff;
    color: black;
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: flex-end;
  }
}
</style>
