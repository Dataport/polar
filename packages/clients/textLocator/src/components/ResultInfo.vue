<template>
  <v-tooltip
    :value="focus"
    color="#00000000"
    v-bind="{ [direction]: true }"
    transition="none"
  >
    <template #activator="{ on, attrs }">
      <v-icon small v-bind="attrs" v-on="on"> fa-info-circle </v-icon>
    </template>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('common:textLocator.addressSearch.resultInfo.name') }}
            </th>
            <th class="text-left">
              {{ $t('common:textLocator.addressSearch.resultInfo.type') }}
            </th>
            <th class="text-left">
              {{ $t('common:textLocator.addressSearch.resultInfo.language') }}
            </th>
            <th class="text-left">
              {{ $t('common:textLocator.addressSearch.resultInfo.timeFrame') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="{ ObjectID, Name, Sprache, Typ, Start, Ende } in feature
              .properties.names"
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

export default Vue.extend({
  name: 'ResultInfo',
  props: {
    feature: {
      type: Object as PropType<
        GeometrySearchState['featureCollection']['features'][number]
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
  },
})
</script>

<style>
/* suppress table wrap; table looks fine as an element in itself */
.v-tooltip__content:has(.v-data-table) {
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
}
</style>
