<template>
  <component :is="wrapperComponent" class="icon-menu-list ma-2">
    <component
      :is="itemComponent"
      v-for="({ plugin, icon, id, hint }, index) of menus"
      :key="index"
      :class="
        deviceIsHorizontal
          ? 'icon-menu-list-item-horizontal'
          : 'icon-menu-list-item'
      "
    >
      <component :is="plugin" v-if="icon === undefined" />
      <template v-else>
        <component
          :is="buttonComponent"
          v-if="buttonComponent"
          :id="id"
          :icon="icon"
          :hint="hint"
          :index="index"
        />
        <IconMenuButton
          v-else
          :id="id"
          :icon="icon"
          :hint="hint"
          :index="index"
        />
        <!-- Content displayed in MoveHandle of the core if has-window-size and has-small-width are true -->
        <component
          :is="plugin"
          v-if="open === index && (!hasWindowSize || !hasSmallWidth)"
          ref="item-component"
          :class="[
            deviceIsHorizontal
              ? 'icon-menu-list-item-content-horizontal'
              : 'icon-menu-list-item-content',
            'icon-menu-list-item-content-scrollable-y',
          ]"
          :style="`max-height: ${maxHeight}; max-width: ${maxWidth}`"
        />
      </template>
    </component>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import IconMenuButton from './IconMenuButton.vue'

export default Vue.extend({
  name: 'IconMenu',
  components: { IconMenuButton },
  data: () => ({ maxWidth: 'inherit' }),
  computed: {
    ...mapGetters([
      'clientHeight',
      'deviceIsHorizontal',
      'hasSmallWidth',
      'hasWindowSize',
    ]),
    ...mapGetters('plugin/iconMenu', ['buttonComponent', 'menus', 'open']),
    asList() {
      return this.menus.length > 1
    },
    wrapperComponent() {
      return this.asList ? 'ul' : 'div'
    },
    itemComponent() {
      return this.asList ? 'li' : 'div'
    },
    maxHeight() {
      if (!this.hasWindowSize) {
        return 'inherit'
      }
      return `calc(${this.clientHeight}px - ${
        this.deviceIsHorizontal ? 'calc(100% + 1.5em)' : '1em'
      })`
    },
  },
  watch: {
    // Fixes an issue if the orientation of a mobile device is changed while a plugin is open
    deviceIsHorizontal(newVal: boolean) {
      if (!newVal) {
        this.updateMaxWidth()
      }
    },
  },
  mounted() {
    addEventListener('resize', this.updateMaxWidth)
    this.updateMaxWidth()
  },
  beforeDestroy() {
    removeEventListener('resize', this.updateMaxWidth)
  },
  methods: {
    updateMaxWidth() {
      this.$nextTick(() => {
        const plugin = this.$refs['item-component']
        if (plugin?.[0]) {
          if (!this.hasWindowSize) {
            const { width, left } = plugin[0].$el.getBoundingClientRect()
            this.maxWidth = `${width + left}px`
          } else {
            this.maxWidth = 'inherit'
          }
        }
      })
    },
  },
})
</script>

<style lang="scss">
.icon-menu-list-item-content,
.icon-menu-list-item-horizontal {
  .v-card__text {
    // Prevents a x-scrollbar being shown if not necessary
    width: inherit;
  }
}
</style>

<style scoped lang="scss">
.icon-menu-list {
  position: relative;
  list-style: none;
  padding: 0;
}

.icon-menu-list-item-horizontal {
  float: left;
  margin-left: 0.5rem;
}

.icon-menu-list-item {
  margin-bottom: 0.5rem;
  z-index: 1;
}

.icon-menu-list-item-content {
  position: absolute;
  white-space: nowrap;
  top: 0;
  right: calc(100% + 0.5em);
}

.icon-menu-list-item-content-horizontal {
  position: absolute;
  white-space: nowrap;
  top: calc(100% + 0.5em);
  right: -0.5em;
}

.icon-menu-list-item-content-scrollable-y {
  z-index: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
</style>
