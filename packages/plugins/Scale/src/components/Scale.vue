<template>
  <div
    id="polar-plugin-scales"
    :title="$t('plugins.scale.label')"
    :aria-label="$t('plugins.scale.label')"
  >
    <select
      v-if="showSelectOptions"
      v-model="scale"
      :title="$t('plugins.scale.scaleSwitcher')"
      :aria-label="$t('plugins.scale.scaleSwitcher')"
      class="scale-as-a-ratio scale-switcher"
      @change="setZoomLevelByScale($event.target.selectedIndex)"
    >
      <option
        v-for="(option, i) in zoomOptions"
        :key="i"
        :value="option.scale"
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
  data() {
    return {
      zoomPluginAvailable: false,
    }
  },
  computed: {
    ...mapGetters('plugin/scale', [
      'scaleToOne',
      'scaleValue',
      'scaleWithUnit',
      'showScaleSwitcher',
      'zoomOptions',
      'zoomMethod',
    ]),
    scaleNumberToScale() {
      return (scale: number) => {
        return '1 : ' + thousandsSeparator(scale)
      }
    },
    scale: {
      get() {
        const scaleToCompare = beautifyScale(this.scaleValue)
        const bestMatchingScale = this.zoomOptions.reduce((prev, curr) => {
          return Math.abs(curr.scale - scaleToCompare) <
            Math.abs(prev.scale - scaleToCompare)
            ? curr
            : prev
        })
        return bestMatchingScale.scale
      },
      set(value: number) {
        this.setScaleValue(value)
      },
    },
    showSelectOptions() {
      return this.showScaleSwitcher && this.zoomMethod
    },
  },
  methods: {
    ...mapMutations('plugin/scale', ['setScaleValue']),
    ...mapActions('plugin/scale', ['zoomToScale']),
    setZoomLevelByScale(index: number) {
      this.zoomToScale(this.zoomOptions[index].zoomLevel)
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

  .scale-switcher {
    cursor: pointer;
    background: var(--polar-primary);
    color: var(--polar-primary-contrast);
    border-radius: 5px;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
    border: 3px solid transparent;
    box-sizing: border-box;
  }

  .scale-switcher:hover,
  .scale-switcher:focus {
    cursor: pointer;
    border: 3px solid var(--polar-primary-contrast);
    outline: 3px solid var(--polar-primary);
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
