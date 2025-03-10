<template>
  <div>
    <ButtonView
      v-if="configuration.geoEditingButtonView"
      :method="updateOpenTool"
      :tools="tools"
    />
    <!-- TODO: Implement MenuView which is default -->
    <MenuView v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { GeoEditingMode } from '../../../types'
import ButtonView from './ButtonView.vue'
import MenuView from './MenuView.vue'

export default Vue.extend({
  name: 'GeoEditing',
  components: { MenuView, ButtonView },
  data: () => ({ open: '' }),
  computed: {
    ...mapGetters('diplan', ['configuration']),
    tools(): Array<Array<{ id: GeoEditingMode; icon: string }>> {
      return [
        [{ id: 'parcel', icon: '$vuetify.icons.flurstuecke-anzeigen' }],
        [
          { id: 'drawPolygon', icon: '$vuetify.icons.group' },
          { id: 'drawCircle', icon: '$vuetify.icons.kreis-einzeichnen' },
          { id: 'merge', icon: '$vuetify.icons.merge-polygon' },
          { id: 'cut', icon: '$vuetify.icons.durchschneiden' },
          { id: 'lasso', icon: '$vuetify.icons.map-lasso' },
        ],
        [{ id: 'edit', icon: '$vuetify.icons.create' }],
        [{ id: 'delete', icon: '$vuetify.icons.delete' }],
      ]
    },
  },
  methods: {
    ...mapActions('diplan', ['trigger']),
    updateOpenTool(id: string) {
      if (this.open === id) {
        this.open = ''
        this.trigger('reset')
        return
      }
      this.open = id
      this.trigger(id)
    },
  },
})
</script>

<style lang="scss" scoped></style>
