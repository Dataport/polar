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
      <!-- TODO: Add invisible border here so that the whole container doesnt wiggle if hovering / focusing -->
      <v-btn
        v-if="mode === 'delete'"
        id="polar-measure-delete-button"
        class="text-none"
        color="primary"
        rounded
        small
        @click="clearLayer"
      >
        {{ $t('plugins.measure.label.deleteAll') }}
      </v-btn>
      <!-- TODO: Properly place this and check what to do with the v-labels; whitespace below this is too large -->
      <!-- TODO: Deleting stuff is not consistent-->
      <!-- TODO: Also just use a Radio here! -->
      <v-switch
        v-if="mode === 'draw'"
        :input-value="measureMode === 'area'"
        color="primary"
        @change="setMeasureMode(measure($event))"
      >
        <template #prepend>
          <v-label> {{ $t('plugins.measure.label.distance') }}</v-label>
        </template>
        <template #append>
          <v-label>{{ $t('plugins.measure.label.area') }}</v-label>
        </template>
      </v-switch>
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
  computed: {
    ...mapGetters('plugin/measure', ['mode', 'measureMode', 'unit']),
    selectableModes: () => ({
      select: 'common:plugins.measure.mode.select',
      draw: 'common:plugins.measure.mode.draw',
      edit: 'common:plugins.measure.mode.edit',
      delete: 'common:plugins.measure.mode.delete',
    }),
    selectableUnits: () => ({ m: 'm / m²', km: 'km / km²' }),
  },
  methods: {
    ...mapActions('plugin/measure', [
      'setMode',
      'setMeasureMode',
      'setUnit',
      'clearLayer',
    ]),
    measure(value: string): string {
      return value ? 'area' : 'distance'
    },
  },
})
</script>

<style lang="scss" scoped>
#polar-measure-card {
  display: flex;
  flex-direction: column;
  overflow: inherit;
}

#polar-measure-delete-button {
  margin-left: 1.5em;
  margin-right: 1.5em;
  padding-left: 2em;
  padding-right: 2em;
}
</style>
