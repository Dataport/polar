<template>
  <div>
    <ButtonView
      v-if="configuration?.diplan?.renderType === 'independent'"
      :method="updateOpenTool"
      :tools="tools"
    />
    <MenuView v-else :method="updateOpenTool" :tools="tools" />
  </div>
  <!-- TODO(ANDERER BRANCH): Diplan-UI nachbauen mit Header und Footer für diplan-ui example-->
  <!-- TODO(ANDERER BRANCH): Zweites Diplan-UI example mit databindings (smol boy) -->

  <!-- TODO(ANDERER BRANCH): Flurstücke-Button nutzbar machen; anpassen, dass dies dauerhaft sein kann ggü. den anderen Buttons -->

  <!-- TODO(ANDERER BRANCH): (Optional:) LayerChooser View soll auch einen Extra-Knopf haben, welcher dann dahinter die Transparenz versteckt hat -->
  <!-- TODO(ANDERER BRANCH): (Optional:) Legende direkt am Layer -->
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
    ...mapGetters(['configuration']),
    tools(): Array<Array<{ id: GeoEditingMode; icon: string }>> {
      return [
        [
          { id: 'drawPolygon', icon: '$vuetify.icons.group' },
          { id: 'drawCircle', icon: '$vuetify.icons.kreis-einzeichnen' },
          { id: 'merge', icon: '$vuetify.icons.merge-polygon' },
          { id: 'cut', icon: '$vuetify.icons.durchschneiden' },
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
