<template>
  <tbody>
    <tr v-for="[key, value] of Object.entries(filteredProperties)" :key="key">
      <td>{{ key }}</td>
      <td
        v-if="
          typeof value === 'string' &&
          value.match(/\.(jpeg|jpg|gif|png)$/) !== null
        "
      >
        <a :href="value" target="_blank">
          <img
            :src="value"
            :alt="$t('plugins.gfi.property.imageAlt')"
            :title="$t('plugins.gfi.property.linkTitle')"
            :aria-label="$t('plugins.gfi.property.linkTitle')"
            :height="photoHeight"
            width="auto"
          />
        </a>
      </td>
      <td v-else-if="isValidHttpUrl(value)">
        <a
          :href="value"
          target="_blank"
          :title="$t('plugins.gfi.property.linkTitle')"
          :aria-label="$t('plugins.gfi.property.linkTitle')"
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
import Vue from 'vue'
import { mapGetters } from 'vuex'
import isValidHttpUrl from '../utils/isValidHttpUrl'

export default Vue.extend({
  name: 'GfiFeatureTableBody',
  computed: {
    ...mapGetters(['clientWidth']),
    ...mapGetters('plugin/gfi', ['currentProperties']),
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
    photoHeight() {
      const height = this.clientWidth * 0.15
      return height < 200 ? 200 : height
    },
  },
  methods: {
    isValidHttpUrl,
  },
})
</script>

<style lang="scss" scoped></style>
