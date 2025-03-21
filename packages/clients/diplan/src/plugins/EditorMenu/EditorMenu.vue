<template>
  <v-card class="diplan-top-out">
    <v-btn-toggle v-model="activeToggle" class="diplan-editor-menu">
      <v-btn
        v-for="({ icon }, index) of buttons"
        :key="`diplan-editor-button-${index}`"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-btn small plain>
      <v-icon small>fa-chevron-down</v-icon>
      <v-icon small style="margin-right: 1em">fa-tools</v-icon>
      Digitalisierungswerkzeuge
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'DiplanEditorMenu',
  data: () => ({
    activeToggle: null,
    buttons: [
      // 'cut' | 'duplicate' | 'merge'
      // 'none' | 'draw' | 'edit' | 'translate' | 'delete' | 'lasso'
      // 'Polygon' | 'Circle'
      { action: '-draw-Polygon', icon: 'fa-draw-polygon' },
      { action: '-draw-Circle', icon: 'fa-regular fa-circle' },
      { action: 'merge--', icon: '$vuetify.icons.merge-polygon' },
      { action: 'duplicate--', icon: 'fa-copy' },
      { action: 'cut--', icon: 'fa-scissors' },
      { action: '-lasso-', icon: '$vuetify.icons.map-lasso' },
      { action: '-edit-', icon: '$vuetify.icons.create' },
      { action: '-translate-', icon: 'fa-regular fa-hand' },
      { action: '-delete-', icon: '$vuetify.icons.delete' },
    ],
  }),
  watch: {
    async activeToggle(index) {
      console.error(index)
      if (typeof index === 'undefined') {
        this.updateDrawMode(null)
      } else {
        const [local, draw, geometry] = this.buttons[index].action.split('-')
        if (local) await this.updateDrawMode(local)
        if (draw) await this.setMode(draw)
        if (geometry) await this.setDrawMode(geometry)
      }
    },
  },
  methods: {
    ...mapActions('diplan', ['updateDrawMode']),
    ...mapActions('plugin/draw', ['setDrawMode', 'setMode']),
  },
})
</script>

<style lang="scss" scoped>
.diplan-editor-menu {
  margin: 12px;
}

.diplan-top-out {
  display: flex;
  flex-direction: column;
  transform: translateY(-72%);
}
</style>
