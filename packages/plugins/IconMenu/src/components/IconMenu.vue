<template>
  <component :is="wrapperComponent" class="icon-menu-list ma-2">
    <component
      :is="itemComponent"
      v-for="({ plugin, icon, id, hint }, index) of menus"
      :key="index"
      :class="
        isHorizontal ? 'icon-menu-list-item-horizontal' : 'icon-menu-list-item'
      "
    >
      <component
        :is="plugin"
        v-if="icon === undefined"
        :is-horizontal="isHorizontal"
      />
      <template v-else>
        <v-tooltip :left="!isHorizontal" :bottom="isHorizontal">
          <template #activator="{ on, attrs }">
            <v-btn
              :color="open === index ? 'primaryContrast' : 'primary'"
              fab
              small
              :aria-label="
                $t(hint ? hint : `common:plugins.iconMenu.hints.${id}`)
              "
              v-bind="attrs"
              @click="toggle(index)"
              v-on="on"
            >
              <v-icon :color="open === index ? 'primary' : 'primaryContrast'">
                {{ icon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{
            $t(hint ? hint : `common:plugins.iconMenu.hints.${id}`)
          }}</span>
        </v-tooltip>
        <component
          :is="plugin"
          v-if="open === index"
          :class="[
            isHorizontal
              ? 'icon-menu-list-item-content-horizontal'
              : 'icon-menu-list-item-content',
            'icon-menu-list-item-content-scrollable-y',
          ]"
          :style="getContentStyle(Number(index))"
        />
      </template>
    </component>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'IconMenu',
  computed: {
    ...mapGetters(['hasSmallHeight', 'hasWindowSize', 'clientHeight']),
    ...mapGetters('plugin/iconMenu', ['menus', 'open']),
    asList() {
      return this.menus.length > 1
    },
    wrapperComponent() {
      return this.asList ? 'ul' : 'div'
    },
    itemComponent() {
      return this.asList ? 'li' : 'div'
    },
    isHorizontal() {
      return this.hasSmallHeight && this.hasWindowSize
    },
    maxHeight() {
      if (!this.hasWindowSize) {
        return 'inherit'
      }
      return `calc(${this.clientHeight}px - ${
        this.isHorizontal ? 'calc(100% + 1.5em)' : '1em'
      })`
    },
  },
  methods: {
    ...mapMutations('plugin/iconMenu', ['setOpen']),
    getContentStyle(index: number) {
      // HACK: Zoom is currently the only plugin that adds two buttons instead of one.
      const zoomIndex = this.menus.findIndex(({ id }) => id === 'zoom')
      const isAfterZoom = zoomIndex < index
      return `max-height: ${this.maxHeight}; ${
        this.isHorizontal
          ? `right: calc(${
              this.menus.length - (isAfterZoom ? index + 1 : index + 2)
            } * (-100% - 0.5rem));`
          : `top: calc(${
              isAfterZoom && zoomIndex !== -1 ? index + 1 : index
            } * (-100% - 0.5rem));`
      }`
    },
    toggle(index) {
      const { open } = this
      if (open === index) {
        this.setOpen(null)
      } else {
        this.setOpen(index)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.icon-menu-list {
  list-style: none;
}

.icon-menu-list-item-horizontal {
  position: relative;
  float: left;
  margin-left: 0.5rem;
}

.icon-menu-list-item {
  position: relative;
  margin-bottom: 0.5rem;
  z-index: 1;
}

.icon-menu-list-item-content {
  position: absolute;
  white-space: nowrap;
  right: calc(100% + 0.5rem);
}

.icon-menu-list-item-content-horizontal {
  position: absolute;
  white-space: nowrap;
  top: 3em;
}

.icon-menu-list-item-content-scrollable-y {
  z-index: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;

  &::v-deep > * {
    /* required for v-card default shadow
     * that, without, sometimes produces scrollbars */
    margin: 2px;
    top: -2px;
    right: -2px;
  }
}
</style>
