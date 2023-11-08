<template>
  <div v-if="!closed" ref="wrapper" class="polar-plugin-dish-modal">
    <component :is="selectedContent"></component>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as focusTrap from 'focus-trap'
import Hints from './Hints.vue'
import Welcome from './Welcome.vue'
import { CONTENT_ENUM } from './store'

const lookup = {
  [CONTENT_ENUM.WELCOME]: Welcome,
  [CONTENT_ENUM.HINTS]: Hints,
}

let trap

export default Vue.extend({
  name: 'DishModal',
  computed: {
    ...mapGetters('plugin/modal', ['confirmed', 'closed', 'content']),
    selectedContent() {
      return lookup[this.content]
    },
  },
  watch: {
    closed(newValue) {
      if (newValue) {
        trap.deactivate()
        trap = null
      } else {
        // Vue must be done rendering before focus can be trapped
        Vue.nextTick(this.trapFocus)
      }
    },
  },
  mounted() {
    this.trapFocus()
  },
  methods: {
    trapFocus() {
      const element = this.$refs.wrapper
      trap = focusTrap.createFocusTrap(element, {
        initialFocus: false,
      })
      trap.activate()
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-plugin-dish-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: #00000033;
  z-index: 2147483647;
  pointer-events: all;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10vh 10vw;
}
</style>

<style lang="scss">
/* these rules apply for both children */
.polar-plugin-dish-modal {
  .modal-card {
    padding: 1em 2em;
    max-height: 80vh;
    overflow-y: auto;

    @media only screen and (max-width: 768px) {
      max-height: 70vh;
    }

    .modal-title {
      word-break: inherit;
      font-size: 1.5rem;
    }

    .v-card__text,
    .modal-title {
      color: #003064 !important; // shBlue
    }

    .modal-link {
      display: block;
      color: #0089ca;
      text-decoration: none;
    }

    .modal-actions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
