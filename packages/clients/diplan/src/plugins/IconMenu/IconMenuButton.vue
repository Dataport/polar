<template>
  <v-tooltip left :disabled="hasSmallDisplay">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="open === index ? 'primary' : 'primaryContrast'"
        width="40"
        height="40"
        :aria-label="$t(hint ? hint : `plugins.iconMenu.hints.${id}`)"
        v-bind="attrs"
        @click="toggle(Number(index))"
        v-on="on"
      >
        <v-icon :color="open === index ? 'primaryContrast' : 'primary'">
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ $t(hint ? hint : `plugins.iconMenu.hints.${id}`) }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'DiplanIconMenuButton',
  props: {
    id: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    hint: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/iconMenu', ['open']),
  },
  methods: {
    ...mapMutations(['setMoveHandle']),
    ...mapMutations('plugin/iconMenu', ['setOpen']),
    ...mapActions('plugin/iconMenu', ['openInMoveHandle']),
    toggle(index: number) {
      if (this.open === index) {
        this.setOpen(null)
        this.setMoveHandle(null)
      } else {
        this.setOpen(index)
        this.openInMoveHandle(index)
      }
      this.$parent.updateMaxWidth()
    },
  },
})
</script>

<style lang="scss" scoped>
.v-btn::before {
  background-color: transparent;
}
.v-btn {
  border: solid transparent;
  padding: 0 !important;
  min-width: 0 !important;
}
</style>
