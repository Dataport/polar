<template>
  <div class="wrapper">
    <div
      v-for="(tag, index) of tags"
      :key="index"
      :class="{
        [tag]: true,
        'has-window-size': hasWindowSize,
      }"
    >
      <plugin-vessel
        v-for="(pluginContainer, innerIndex) of getSortedTo(tag)"
        :key="`${index}-${innerIndex}`"
        v-bind="{ pluginContainer }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { PluginContainer } from '@polar/lib-custom-types'
import PluginVessel from '../MapPlugin.vue'
import { sortPlugins } from '../../utils/sortPluginsByLayout'
import { NineLayoutTag } from './NineLayoutTag'

const tags = Object.values(NineLayoutTag)

export default Vue.extend({
  components: {
    PluginVessel,
  },
  data: () => ({
    tags,
  }),
  computed: {
    ...mapGetters(['components', 'hasWindowSize']),
    // creating plugin lists for all enums
    //  reduces to list of functions, each returning a list of plugins which are sorted by layout
    ...tags.reduce((acc, curr) => {
      acc[curr] = function () {
        return sortPlugins(this.components, curr) as PluginContainer[]
      }
      return acc
    }, {}),
  },
  methods: {
    getSortedTo(name) {
      return this[name]
    },
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  padding: 6px;

  .nine-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;

    &.has-window-size {
      max-height: 100%;
    }

    &.mid {
      top: 33%;
      left: 33%;
      right: 33%;
      bottom: 33%;
    }

    &.left {
      left: 0;
      right: auto;
      align-items: flex-start;
    }

    &.right {
      right: 0;
      left: 66%;
      align-items: flex-end;
    }

    &.top {
      top: 0;
      justify-content: flex-start;
    }

    &.bottom {
      bottom: 0;
      justify-content: flex-end;
    }
  }
}
</style>
