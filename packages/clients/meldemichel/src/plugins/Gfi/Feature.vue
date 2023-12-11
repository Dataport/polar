<template>
  <v-card>
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
      <!-- TODO implement when vector clusters are done
      <v-btn>Prev</v-btn>
      <v-btn>Next</v-btn>
      -->
      <v-spacer />
      <v-btn
        icon
        small
        :aria-label="$t('common:plugins.gfi.header.close')"
        @click="close"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="meldemichel-gfi-title">
      {{ $t('meldemichel.gfi.title') }}<br />
      {{ `${currentProperties.str} ${currentProperties.hsnr}` }}
    </v-card-title>
    <img
      v-if="displayImage"
      :src="currentProperties.pic"
      style="width: 100%"
      draggable="false"
      @load="resize"
    />
    <v-card-text>
      <v-simple-table dense>
        <template #default>
          <tbody>
            <tr v-for="item in infoFields" :key="item">
              <td class="meldemichel-fat-cell">
                {{ $t(`meldemichel.gfi.${item}`) }}
              </td>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <td
                v-html="$t(formatProperty(item, currentProperties[item]))"
              ></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-title>{{ $t(`meldemichel.gfi.beschr`) }}</v-card-title>
    <v-card-text>{{ currentProperties['beschr'] }}</v-card-text>
    <v-card-title>{{ $t(`meldemichel.gfi.rueck`) }}</v-card-title>
    <v-card-text>{{ currentProperties['rueck'] }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeoJsonProperties } from 'geojson'
import { mapActions, mapGetters, mapMutations } from 'vuex'

type GfiIndexStep = -1 | 1

export default Vue.extend({
  name: 'MeldemichelGfiFeature',
  props: {
    currentProperties: {
      type: Object as PropType<GeoJsonProperties>,
      required: true,
    },
    clientWidth: {
      type: Number,
      required: true,
    },
    exportProperty: {
      type: String,
      default: '',
    },
    showSwitchButtons: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    infoFields: ['skat', 'start', 'statu'],
  }),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', [
      'imageLoaded',
      'visibleWindowFeatureIndex',
      'windowFeatures',
    ]),
    displayImage(): boolean {
      return this.currentProperties.pic
    },
  },
  methods: {
    ...mapMutations('plugin/gfi', [
      'setImageLoaded',
      'setVisibleWindowFeatureIndex',
    ]),
    ...mapActions('plugin/gfi', ['close']),
    formatProperty(type: string, value: string): string {
      if (!value) {
        return ''
      }
      if (type === 'skat') {
        return `meldemichel.skat.${value}`
      }
      if (type === 'start') {
        return `${value.substring(6, 8)}.${value.substring(
          4,
          6
        )}.${value.substring(0, 4)}`
      }
      return value
    },
    resize(e: Event) {
      if ((e.currentTarget as HTMLImageElement).complete && !this.imageLoaded) {
        this.setImageLoaded(true)
        window.dispatchEvent(new Event('resize'))
      }
    },
    /** switch to next or previous feature */
    switchFeature(by: GfiIndexStep): void {
      const {
        visibleWindowFeatureIndex,
        windowFeatures,
        setVisibleWindowFeatureIndex,
      } = this
      const maxIndex = windowFeatures.length - 1
      const nextIndex = visibleWindowFeatureIndex + by
      if (nextIndex < 0) {
        setVisibleWindowFeatureIndex(windowFeatures.length - 1)
      } else if (nextIndex > maxIndex) {
        setVisibleWindowFeatureIndex(0)
      } else {
        setVisibleWindowFeatureIndex(nextIndex)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
* {
  color: #003064 !important;
}

.meldemichel-gfi-card {
  min-width: 20vw;
}

.meldemichel-export-button .v-icon {
  margin-right: 0.4em;
}

.meldemichel-fat-cell {
  font-weight: bolder;
  white-space: nowrap;
}

.meldemichel-gfi-title {
  padding-top: 0 !important;
  word-break: break-word;
}
</style>
