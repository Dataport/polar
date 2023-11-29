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
              @click="toggle(Number(index))"
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
        <template v-if="open === index">
          <MoveHandle
            v-if="hasWindowSize && hasSmallWidth"
            :use-default-icons="true"
            :close-label="
              $t('plugins.iconMenu.mobileCloseButton', {
                plugin: hint ? hint : `common:plugins.iconMenu.hints.${id}`,
              })
            "
            :close-function="() => toggle(Number(index))"
            :container-as-handle="true"
            :max-height="maxMobileHeight"
          >
            <component :is="plugin" ref="item-component" />
          </MoveHandle>
          <component
            :is="plugin"
            v-else
            ref="item-component"
            :class="[
              isHorizontal
                ? 'icon-menu-list-item-content-horizontal'
                : 'icon-menu-list-item-content',
              'icon-menu-list-item-content-scrollable-y',
            ]"
            :style="`max-height: ${maxHeight}; max-width: ${maxWidth}`"
          />
        </template>
      </template>
    </component>
  </component>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { MoveHandle } from '@polar/components'

export default Vue.extend({
  name: 'IconMenu',
  components: {
    MoveHandle,
  },
  data: () => ({ maxMobileHeight: 1, maxWidth: 'inherit' }),
  computed: {
    ...mapGetters([
      'hasSmallHeight',
      'hasSmallWidth',
      'hasWindowSize',
      'clientHeight',
    ]),
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
  watch: {
    // Fixes an issue if the orientation of a mobile device is changed while a plugin is open
    isHorizontal(newVal: boolean) {
      if (!newVal) {
        this.updateWindowSizing()
      }
    },
  },
  mounted() {
    addEventListener('resize', this.updateWindowSizing)
    this.updateWindowSizing()
  },
  beforeDestroy() {
    removeEventListener('resize', this.updateWindowSizing)
  },
  methods: {
    ...mapMutations('plugin/iconMenu', ['setOpen']),
    toggle(index: number) {
      if (this.open === index) {
        this.setOpen(null)
      } else {
        this.setOpen(index)
      }
      this.updateWindowSizing()
    },
    updateWindowSizing() {
      this.$nextTick(() => {
        const plugin = this.$refs['item-component']
        if (plugin?.[0]) {
          if (!this.hasWindowSize) {
            const { width, left } = plugin[0].$el.getBoundingClientRect()
            this.maxWidth = `${width + left}px`
          } else {
            this.maxWidth = 'inherit'
            if (open !== null) {
              this.$nextTick(() => {
                this.maxMobileHeight =
                  plugin[0].$el.offsetParent.clientHeight /
                  this.$root.$el.clientHeight
              })
            }
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

<style lang="scss" scoped>
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

  &::v-deep > * {
    /* required for v-card default shadow
     * that, without, sometimes produces scrollbars */
    margin: 2px;
    top: -2px;
    right: -2px;
  }
}
</style>
