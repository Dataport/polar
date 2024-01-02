<template>
  <v-card>
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
      <ActionButtons />
      <v-spacer />
      <v-btn
        icon
        small
        :aria-label="$t('common:plugins.gfi.header.close')"
        @click="close"
      >
        <v-icon small>fa-angles-right</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="meldemichel-gfi-title">
      {{ $t('meldemichel.gfi.title') }}<br />
      {{ `${currentProperties.str} ${currentProperties.hsnr}` }}
    </v-card-title>
    <img
      v-if="displayImage"
      :src="currentProperties.pic"
      class="meldemichel-gfi-img"
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
              <td>
                {{ $t(formatProperty(item, currentProperties[item])) }}
              </td>
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
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { GeoJsonProperties } from 'geojson'
import ActionButtons from './ActionButtons.vue'

export default Vue.extend({
  name: 'MeldemichelGfiFeature',
  components: {
    ActionButtons,
  },
  props: {
    clientWidth: {
      type: Number,
      required: true,
    },
    exportProperty: {
      type: String,
      default: '',
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
    currentProperties(): GeoJsonProperties {
      return { ...this.windowFeatures[this.visibleWindowFeatureIndex] }
    },
  },
  mounted() {
    this.setMoveHandleActionButton({
      component: ActionButtons,
      props: {},
    })
  },
  beforeDestroy() {
    this.setMoveHandleActionButton(null)
  },
  methods: {
    ...mapMutations(['setMoveHandleActionButton']),
    ...mapMutations('plugin/gfi', [
      'setImageLoaded',
      'setVisibleWindowFeatureIndex',
    ]),
    ...mapMutations(['setMoveHandle']),
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
      if (type === 'statu') {
        return `meldemichel.status.${value}`
      }
      return value
    },
    resize(e: Event) {
      if ((e.currentTarget as HTMLImageElement).complete && !this.imageLoaded) {
        this.setImageLoaded(true)
        window.dispatchEvent(new Event('resize'))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
* {
  color: #003064 !important;
}

.meldemichel-fat-cell {
  font-weight: bolder;
  white-space: nowrap;
}

.meldemichel-gfi-title {
  padding-top: 0;
  word-break: break-word;
}

.meldemichel-gfi-img {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}
</style>
