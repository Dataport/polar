<template>
  <div>
    <v-card-title>{{ $t('plugins.draw.title.options') }}</v-card-title>
    <v-card-actions>
      <v-col>
        <v-btn
          class="polar-draw-color-picker-button"
          @click="toggleColorPicker"
        >
          <v-label>{{ $t('plugins.draw.options.stroke') }}</v-label>
          <v-icon right>
            {{
              isColorPickerVisible
                ? 'fa-solid fa-chevron-up'
                : 'fa-solid fa-chevron-down'
            }}
          </v-icon>
        </v-btn>
        <v-expand-transition>
          <v-color-picker
            v-if="isColorPickerVisible"
            class="polar-draw-color-picker"
            :value="selectedStrokeColor"
            @input="setSelectedStrokeColor"
          ></v-color-picker>
        </v-expand-transition>
      </v-col>
    </v-card-actions>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'DrawOptions',
  data: () => ({
    isColorPickerVisible: false,
  }),
  computed: {
    ...mapGetters('plugin/draw', ['selectedStrokeColor']),
  },
  methods: {
    ...mapActions('plugin/draw', ['setSelectedStrokeColor']),
    toggleColorPicker() {
      this.isColorPickerVisible = !this.isColorPickerVisible
    },
  },
})
</script>

<style lang="scss" scoped>
.v-card__title {
  padding-top: 0;
  padding-bottom: 0;
  font-size: 100%;
}

.v-card__actions {
  padding-top: 0;
}

.polar-draw-color-picker {
  margin-top: 0.5em;
}
.polar-draw-color-picker-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  border: solid transparent;
  color: var(--polar-secondary);
  background-color: var(--polar-secondary-contrast);

  label {
    color: var(--polar-secondary);
  }
}
</style>
