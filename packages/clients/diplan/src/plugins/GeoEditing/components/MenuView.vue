<template>
  <v-scroll-x-reverse-transition>
    <v-card class="geo-editing-menu">
      <v-list tag="ul" color="primaryContrast" elevation="5">
        <template v-for="(toolset, index) in tools">
          <v-list-item v-for="{ id, icon } of toolset" :key="id" tag="li">
            <v-btn
              :color="$parent.active === id ? 'primary' : 'primaryContrast'"
              depressed
              :aria-label="$t(`diplan.geoEditing.tools.${id}`)"
              @click="method(id)"
            >
              <v-icon
                :color="$parent.active === id ? 'primaryContrast' : 'primary'"
              >
                {{ icon }}
              </v-icon>
              <span>{{ $t(`diplan.geoEditing.tools.${id}`) }}</span>
            </v-btn>
          </v-list-item>
          <v-divider v-if="index !== tools.length - 1" :key="index" />
        </template>
      </v-list>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeoEditingMode } from '../../../types'

export default Vue.extend({
  name: 'MenuView',
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
  beforeDestroy() {
    this.$parent.active = ''
    this.$parent.trigger('reset')
  },
})
</script>

<style lang="scss" scoped>
.geo-editing-menu {
  z-index: 1;
  min-width: 300px;

  ul {
    padding: 0;

    li {
      padding: 0;

      .v-btn::before {
        background-color: transparent;
      }
      button {
        border: solid transparent;
        padding: 8px !important;
        min-width: 0 !important;
        width: 100%;
        justify-content: flex-start;
        text-transform: inherit;

        .v-icon {
          margin-right: 16px;
        }
      }
    }
  }
}
</style>
