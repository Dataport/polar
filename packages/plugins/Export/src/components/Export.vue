<template>
  <div :class="'export-wrapper ' + flow">
    <export-button
      color="primary"
      fab
      :click="singleExport ? () => exportFile(singleExport) : toggleButtons"
      icon="fa-image"
      :hint="mainButtonHint"
    ></export-button>
    <v-scroll-x-transition>
      <div v-if="visible" :class="'export-wrapper export-center ' + flow">
        <export-button
          v-if="showJpg"
          color="secondary"
          small
          fab
          :click="() => exportFile(format.JPG)"
          icon="fa-image"
          small-icon
          hint="plugins.export.buttons.jpg"
        ></export-button>
        <export-button
          v-if="showPng"
          color="secondary"
          small
          fab
          :click="() => exportFile(format.PNG)"
          icon="fa-image"
          small-icon
          hint="plugins.export.buttons.png"
        ></export-button>
        <export-button
          v-if="showPdf"
          color="secondary"
          small
          fab
          :click="() => exportFile(format.PDF)"
          icon="fa-file"
          small-icon
          hint="plugins.export.buttons.pdf"
        ></export-button>
      </div>
    </v-scroll-x-transition>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { ExportComponent, ExportFormat } from '../types'
import Button from './Button.vue'

export default (Vue as VueConstructor<ExportComponent>).extend({
  name: 'PolarExport',
  components: {
    ExportButton: Button,
  },
  data: () => ({
    // Show format buttons
    visible: false,
  }),
  computed: {
    ...mapGetters('plugin/export', [
      'openInDirection',
      'showJpg',
      'showPdf',
      'showPng',
    ]),
    ...mapGetters(['map']),
    format() {
      return ExportFormat
    },
    // Direction of expansion
    flow() {
      return 'export-' + this.openInDirection
    },
    singleExport() {
      if (this.showJpg + this.showPng + this.showPdf === 1) {
        if (this.showJpg) return ExportFormat.JPG
        if (this.showPng) return ExportFormat.PNG
        if (this.showPdf) return ExportFormat.PDF
      }

      return false
    },
    mainButtonHint() {
      if (!this.singleExport) {
        return 'plugins.export.buttons.toggle'
      }
      return {
        [ExportFormat.JPG]: 'plugins.export.buttons.jpg',
        [ExportFormat.PNG]: 'plugins.export.buttons.png',
        [ExportFormat.PDF]: 'plugins.export.buttons.pdf',
      }[this.singleExport]
    },
  },
  methods: {
    ...mapActions('plugin/export', ['exportAs']),
    toggleButtons() {
      this.visible = !this.visible
    },
    exportFile(format) {
      this.exportAs(format)
      this.visible = false
    },
  },
})
</script>

<style lang="scss" scoped>
.export-wrapper {
  display: flex;
}
.export-center {
  align-items: center;
}
.export-up {
  flex-direction: column-reverse;
}
.export-down {
  flex-direction: column;
}
.export-left {
  flex-direction: row-reverse;
}
.export-right {
  flex-direction: row;
}
</style>
