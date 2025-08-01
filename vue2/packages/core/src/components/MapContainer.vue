<template>
  <v-app class="polar-wrapper">
    <MoveHandle
      v-if="renderMoveHandle"
      ref="moveHandleElement"
      :key="moveHandleKey"
      :close-label="moveHandle.closeLabel"
      :close-function="moveHandle.closeFunction"
    >
      <template v-if="moveHandleActionButton" #actionButton>
        <component
          :is="moveHandleActionButton.component"
          v-bind="moveHandleActionButton.props"
        />
      </template>
      <template v-if="moveHandle.closeIcon" #closeIcon>
        {{ moveHandle.closeIcon }}
      </template>
      <template #default>
        <component :is="moveHandle.component" v-bind="moveHandle.props || {}" />
      </template>
    </MoveHandle>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { MoveHandle } from '@polar/components'
import { MoveHandleProperties } from '@polar/lib-custom-types'
// NOTE: OpenLayers styles need to be imported as the map resides in the shadow DOM
import 'ol/ol.css'

export default Vue.extend({
  components: {
    MoveHandle,
  },
  data: (): {
    moveHandleKey: number
  } => ({
    moveHandleKey: 0,
  }),
  computed: {
    ...mapGetters([
      'hasSmallWidth',
      'hasWindowSize',
      'moveHandle',
      'moveHandleActionButton',
    ]),
    renderMoveHandle() {
      return (
        this.moveHandle !== null && this.hasWindowSize && this.hasSmallWidth
      )
    },
  },
  watch: {
    moveHandle(_: MoveHandleProperties, oldHandle: MoveHandleProperties) {
      // Makes sure the previous plugin is properly closed if the "normal" way of closing isn't used
      if (
        oldHandle &&
        typeof oldHandle.closeFunction === 'function' &&
        (this.moveHandle === null ||
          this.moveHandle.plugin !== oldHandle.plugin)
      ) {
        oldHandle.closeFunction(false)
      }
      // Make sure the element is properly updated.
      this.moveHandleKey += 1
    },
  },
})
</script>

<style lang="scss">
.polar-wrapper.v-application .v-btn:focus {
  border: solid var(--polar-primary-contrast) !important;
  outline: solid var(--polar-primary);
  outline-offset: 1px;
}
.polar-wrapper.v-application .v-btn:hover {
  border: solid var(--polar-primary-contrast) !important;
  outline: solid var(--polar-primary);
  outline-offset: 1px;
}
</style>
