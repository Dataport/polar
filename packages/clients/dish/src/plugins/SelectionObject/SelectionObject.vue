<template>
  <div v-if="objectId">
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          elevation="2"
          :class="{ 'ma-2': renderType === 'independent' }"
          color="primary"
          small
          fab
          :aria-label="$t('plugins.dish.selectionObject.object')"
          v-bind="attrs"
          v-on="on"
          @click="toggleVisibility"
        >
          <v-icon>{{ isVisible ? 'fa fa-eye' : 'fa-eye-slash' }}</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('plugins.dish.selectionObject.visibility') }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import selectionLayer from '../../selectionLayer'

export default Vue.extend({
  name: 'SelectionObject',
  data: () => ({
    isVisible: true,
  }),
  computed: {
    ...mapGetters('plugin/selectionObject', ['objectId', 'renderType']),
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible
      selectionLayer.setVisible(this.isVisible)
    },
  },
})
</script>

<style lang="scss" scoped></style>
