<template>
  <v-tooltip left :disabled="hasSmallDisplay">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="open === index ? 'primaryContrast' : 'primary'"
        fab
        small
        :aria-label="$t(hint ? hint : `plugins.iconMenu.hints.${id}`)"
        v-bind="attrs"
        @click="toggle(index)"
        v-on="on"
      >
        <v-icon :color="open === index ? 'primary' : 'primaryContrast'">
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
  name: 'IconMenuButton',
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

<style scoped lang="scss"></style>
