<template>
  <ButtonView
    v-if="configuration?.diplan?.renderType === 'independent'"
    :method="updateOpenTool"
    :tools="tools"
  />
  <MenuView v-else :method="updateOpenTool" :tools="tools" />
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
  data: () => ({ active: '' }),
  computed: {
    ...mapGetters(['configuration']),
    tools(): Array<Array<{ id: GeoEditingMode; icon: string }>> {
      return [
        [
          { id: 'drawPolygon', icon: '$vuetify.icons.group' },
          { id: 'drawCircle', icon: '$vuetify.icons.kreis-einzeichnen' },
          { id: 'merge', icon: '$vuetify.icons.merge-polygon' },
          { id: 'cut', icon: '$vuetify.icons.durchschneiden' },
          { id: 'duplicate', icon: '$vuetify.icons.copy' },
          { id: 'lasso', icon: '$vuetify.icons.map-lasso' },
        ],
        [
          { id: 'edit', icon: '$vuetify.icons.create' },
          { id: 'translate', icon: 'fa-regular fa-hand' },
        ],
        [{ id: 'delete', icon: '$vuetify.icons.delete' }],
      ]
    },
  },
  methods: {
    ...mapActions('diplan', ['trigger']),
    updateOpenTool(id: string) {
      if (this.active === id) {
        this.active = ''
        this.trigger('reset')
        return
      }
      this.active = id
      this.trigger(id)
    },
  },
})
</script>

<style lang="scss" scoped></style>
