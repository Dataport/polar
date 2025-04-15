<template>
  <div>
    <v-date-picker
      v-model="dates"
      range
      no-title
      scrollable
      elevation="5"
      :min="minDate"
      :max="maxDate"
      :first-day-of-week="1"
      :locale="language"
      :next-month-aria-label="$t('plugins.filter.time.vuetify.aria.nextMonth')"
      :next-year-aria-label="$t('plugins.filter.time.vuetify.aria.nextYear')"
      :prev-month-aria-label="$t('plugins.filter.time.vuetify.aria.prevMonth')"
      :prev-year-aria-label="$t('plugins.filter.time.vuetify.aria.prevYear')"
    ></v-date-picker>
    <p class="polar-filter-time-frame-explanation">
      {{ $t('plugins.filter.time.chooseTimeFrame.info') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'PolarFilterChooseTimeFrame',
  props: {
    layerId: {
      type: String,
      required: true,
    },
    now: {
      type: String,
      required: true,
      validator: function (value: string | undefined): boolean {
        return ['until', 'from', undefined].includes(value)
      },
    },
  },
  computed: {
    ...mapGetters('plugin/filter', ['getFreeSelection']),
    ...mapGetters(['language']),
    dates: {
      get() {
        return this.getFreeSelection(this.layerId)
      },
      set(freeSelection) {
        this.changeFreeSelection({
          freeSelection,
          layerId: this.layerId,
        })
      },
    },
    minDate() {
      if (this.now === 'from') {
        return new Date(Date.now()).toISOString().split('T')[0]
      }
      return undefined
    },
    maxDate() {
      if (this.now === 'until') {
        return new Date(Date.now()).toISOString().split('T')[0]
      }
      return undefined
    },
  },
  methods: {
    ...mapActions('plugin/filter', ['changeFreeSelection']),
  },
})
</script>

<style lang="scss" scoped>
.polar-filter-time-frame-explanation {
  letter-spacing: 0.05em;
  font-size: 13px;
  line-height: 14px;
  margin-top: 0.5em;
  margin-bottom: 0;
}
</style>
