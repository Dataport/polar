<template>
  <v-list tag="ul" color="primaryContrast" elevation="5" class="ma-2">
    <template v-for="(toolset, index) in tools">
      <v-list-item v-for="{ id, icon } of toolset" :key="id" tag="li">
        <v-tooltip left :disabled="hasSmallDisplay">
          <template #activator="{ on, attrs }">
            <v-btn
              :color="$parent.active === id ? 'primary' : 'primaryContrast'"
              small
              depressed
              width="40"
              height="40"
              :aria-label="$t(`diplan.geoEditing.tools.${id}`)"
              v-bind="attrs"
              @click="method(id)"
              v-on="on"
            >
              <v-icon
                :color="$parent.active === id ? 'primaryContrast' : 'primary'"
              >
                {{ icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t(`diplan.geoEditing.tools.${id}`) }}</span>
        </v-tooltip>
      </v-list-item>
      <v-divider v-if="index !== tools.length - 1" :key="index" />
    </template>
  </v-list>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { GeoEditingMode } from '../../../types'

export default Vue.extend({
  name: 'ButtonView',
  props: {
    method: {
      type: Function,
      required: true,
    },
    tools: {
      type: Array as PropType<
        Array<Array<{ id: GeoEditingMode; icon: string }>>
      >,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['hasSmallDisplay']),
  },
})
</script>

<style scoped lang="scss">
ul {
  position: relative;
  list-style: none;
  padding: 0;

  li {
    padding: 0;

    .v-btn::before {
      background-color: transparent;
    }
    button {
      border: solid transparent;
      padding: 0 !important;
      min-width: 0 !important;
    }
  }
}
</style>
