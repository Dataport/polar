<template>
  <v-scroll-x-reverse-transition>
    <v-card id="polar-measure-card">
      <RadioCard
        id="measure-mode"
        title="plugins.measure.title.mode"
        :change-callback="setMode"
        :initial-value="mode"
        :values="selectableModes"
      ></RadioCard>
      <template v-if="mode === 'delete'">
        <v-card-text id="polar-measure-delete-alert">
          <v-alert
            v-model="deleteInformationVisibility"
            width="200"
            type="info"
            prominent
            dense
            colored-border
            :icon="false"
            border="left"
            dismissible
            elevation="4"
          >
            {{ $t('plugins.measure.delete.information') }}
          </v-alert>
        </v-card-text>
        <div id="polar-measure-delete-button-wrapper">
          <v-btn
            id="polar-measure-delete-button"
            class="text-none"
            color="primary"
            rounded
            small
            @click="clearLayer"
          >
            {{ $t('plugins.measure.delete.button') }}
          </v-btn>
        </div>
      </template>
      <RadioCard
        v-if="mode === 'draw'"
        id="measure-measureMode>"
        title="plugins.measure.title.measureMode"
        :change-callback="setMeasureMode"
        :initial-value="measureMode"
        :values="selectableMeasureModes"
      ></RadioCard>
      <RadioCard
        id="measure-unit"
        title="plugins.measure.title.unit"
        :change-callback="setUnit"
        :initial-value="unit"
        :values="selectableUnits"
      ></RadioCard>
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { RadioCard } from '@polar/core'

export default Vue.extend({
  name: 'PolarMeasure',
  components: {
    RadioCard,
  },
  data: () => ({
    deleteInformationVisibility: true,
  }),
  computed: {
    ...mapGetters('plugin/measure', ['mode', 'measureMode', 'unit']),
    selectableMeasureModes: () => ({
      distance: 'common:plugins.measure.measureMode.distance',
      area: 'common:plugins.measure.measureMode.area',
    }),
    selectableModes: () => ({
      none: 'common:plugins.measure.mode.none',
      select: 'common:plugins.measure.mode.select',
      draw: 'common:plugins.measure.mode.draw',
      edit: 'common:plugins.measure.mode.edit',
      delete: 'common:plugins.measure.mode.delete',
    }),
    selectableUnits: () => ({
      m: 'common:plugins.measure.unit.metres',
      km: 'common:plugins.measure.unit.kilometres',
    }),
  },
  methods: {
    ...mapActions('plugin/measure', [
      'setMode',
      'setMeasureMode',
      'setUnit',
      'clearLayer',
    ]),
  },
})
</script>

<style lang="scss" scoped>
#polar-measure-card {
  white-space: pre-line;
  min-width: 190px;
}

#polar-measure-delete-alert {
  min-width: 200px;
  padding-top: 0;

  .v-alert {
    margin-bottom: 0;
  }
}

#polar-measure-delete-button-wrapper {
  display: flex;
  justify-content: center;

  button {
    padding-left: 2em;
    padding-right: 2em;
    border: solid transparent;
  }
}
</style>
