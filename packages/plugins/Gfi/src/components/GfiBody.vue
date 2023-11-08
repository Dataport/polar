<template>
  <!-- TODO Rename this and Head to TableX -->
  <tbody>
    <tr v-for="[key, value] of Object.entries(filteredProperties)" :key="key">
      <td>{{ key }}</td>
      <td v-if="value.match(/\.(jpeg|jpg|gif|png)$/) !== null">
        <a :href="value" target="_blank">
          <img
            :src="value"
            :alt="$t('common:plugins.gfi.property.imageAlt')"
            :title="$t('common:plugins.gfi.property.linkTitle')"
            :aria-label="$t('common:plugins.gfi.property.linkTitle')"
            :height="photoHeight < 200 ? 200 : photoHeight"
            width="auto"
          />
        </a>
      </td>
      <td v-else-if="isValidHttpUrl(value)">
        <a
          :href="value"
          target="_blank"
          :title="$t('common:plugins.gfi.property.linkTitle')"
          :aria-label="$t('common:plugins.gfi.property.linkTitle')"
        >
          {{ 'Link' }}
        </a>
      </td>
      <td v-else>
        {{ value }}
      </td>
    </tr>
  </tbody>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeoJsonProperties } from 'geojson'
import isValidHttpUrl from '../utils/isValidHttpUrl'

export default Vue.extend({
  name: 'GfiBody',
  props: {
    currentProperties: {
      type: Object as PropType<GeoJsonProperties>,
      required: true,
    },
    photoHeight: {
      type: Number,
      default: 250,
    },
  },
  computed: {
    /** Removes polarInternalLayerKey as it shouldn't be displayed to the user. */
    filteredProperties() {
      if (this.currentProperties) {
        return Object.fromEntries(
          Object.entries(this.currentProperties).filter(
            ([key]) => key !== 'polarInternalLayerKey'
          )
        )
      }
      return {}
    },
  },
  methods: {
    isValidHttpUrl,
  },
})
</script>

<style lang="scss" scoped></style>
