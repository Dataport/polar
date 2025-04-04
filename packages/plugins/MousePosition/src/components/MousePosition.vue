<template>
  <div class="mouse-position">
    <span class="mouse-position-coordinates">
      {{ mousePosition }}
    </span>
    <v-tooltip top :text="$t('plugins.mousePosition.selectCrsTooltip')">
      <template #activator="{ hover, attrs }">
        <!-- TODO remove form, it's not a form -->
        <form
          id="projection-form"
          class="mouse-position-element"
          v-bind="attrs"
          v-on="hover"
        >
          <label for="projection"> Projection </label>
          <select v-model="projection" @change="selectProjection(projection)">
            <option
              v-for="(namedProjection, i) in projections"
              :key="i"
              :value="namedProjection"
            >
              {{ namedProjection }}
            </option>
          </select>
        </form>
      </template>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'MousePosition',
  computed: {
    ...mapGetters(['hasSmallDisplay', 'configuration']),
    ...mapGetters('plugin/mousePosition', [
      'projections',
      'mousePosition',
      'selectedProjection',
    ]),
    // TODO retrieve value from store
    projection() {
      return this.configuration.epsg
    },
  },
  methods: {
    ...mapActions('plugin/mousePosition', ['selectProjection']),
  },
})
</script>

<style lang="scss" scoped>
.mouse-position {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 4px;

  .mouse-position-coordinates {
    background-color: #fff;
    padding-left: 1em;
    padding-right: 1em;
  }
}

#projection-form {
  border-left: 2px solid #000;
}

.tooltip-wrapper:hover .tooltip__text {
  visibility: visible;
  opacity: 1;
}
</style>
