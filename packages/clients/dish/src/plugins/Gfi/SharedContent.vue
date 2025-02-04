<template>
  <v-card v-if="showGfi" class="dish-gfi-content">
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
      <ActionButton></ActionButton>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        :aria-label="$t('plugins.gfi.header.close')"
        @click="close(true)"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import ActionButton from './ActionButton.vue'

export default Vue.extend({
  name: 'SharedContent',
  components: { ActionButton },
  props: {
    showGfi: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
  },
  mounted() {
    if (this.hasWindowSize && this.hasSmallWidth) {
      this.setMoveHandleActionButton({
        component: ActionButton,
      })
    }
  },
  beforeDestroy() {
    this.setMoveHandleActionButton(null)
  },
  methods: {
    ...mapMutations(['setMoveHandleActionButton']),
    ...mapActions('plugin/gfi', ['close']),
  },
})
</script>

<style lang="scss" scoped></style>
