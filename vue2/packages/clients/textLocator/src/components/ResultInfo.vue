<template>
  <v-tooltip
    :value="focus"
    color="#00000000"
    v-bind="{ [direction]: true }"
    transition="none"
  >
    <template #activator="{ on, attrs }">
      <span :tabindex="tabIndex" v-bind="attrs" v-on="on">
        <v-icon small> fa-info-circle </v-icon>
      </span>
    </template>
    <p v-if="isLiterature" class="result-info-title-display">
      {{ featureAsLiterature.title }}
    </p>
    <v-simple-table v-else dense>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('textLocator.addressSearch.resultInfo.name') }}
            </th>
            <th class="text-left">
              {{ $t('textLocator.addressSearch.resultInfo.type') }}
            </th>
            <th class="text-left">
              {{ $t('textLocator.addressSearch.resultInfo.language') }}
            </th>
            <th class="text-left">
              {{ $t('textLocator.addressSearch.resultInfo.timeFrame') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="{
              ObjectID,
              Name,
              Sprache,
              Typ,
              Start,
              Ende,
            } in featureAsGeometry.properties.names"
            :key="ObjectID"
          >
            <td>{{ Name }}</td>
            <td>{{ Typ }}</td>
            <td>{{ Sprache }}</td>
            <td>{{ Start }} – {{ Ende }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-tooltip>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeometrySearchState } from '../plugins/GeometrySearch/types'
import { LiteratureFeature } from '../types'

export default Vue.extend({
  name: 'ResultInfo',
  props: {
    feature: {
      type: Object as PropType<
        | GeometrySearchState['featureCollection']['features'][number]
        | LiteratureFeature
      >,
      required: true,
    },
    focus: {
      type: Boolean,
      default: false,
      required: false,
    },
    direction: {
      type: String as PropType<'top' | 'right' | 'bottom' | 'left'>,
      default: 'right',
      required: false,
    },
    tabIndex: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    isLiterature() {
      return Boolean(this.feature.properties.location_hits)
    },
    featureAsGeometry() {
      return this
        .feature as GeometrySearchState['featureCollection']['features'][number]
    },
    featureAsLiterature() {
      return this.feature as LiteratureFeature
    },
  },
})
</script>

<style scoped>
.v-icon {
  margin-left: 0.5em;
}

.result-info-title-display {
  background: #f5f5f5;
  color: #333;
  max-width: 30ch;
  padding: 0.5em 1em;
}
</style>

<style>
/* suppress table wrap; table looks fine as an element in itself */
.v-tooltip__content:has(.v-data-table) {
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
}
</style>
