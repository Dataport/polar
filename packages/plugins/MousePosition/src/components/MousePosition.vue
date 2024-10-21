<template>
  <div id="mouse-position-tool">
    <span class="mouse-position-element">
      {{ mousePosition }}
    </span>
    <v-tooltip top text="Select a coordinate reference system">
      <template #activator="{ hover, attrs }">
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
import { mapConfiguration } from '../../../../clients/snowbox/src/mapConfiguration'

export default Vue.extend({
  name: 'MousePosition',
  data() {
    return { projection: mapConfiguration.epsg }
  },
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/mousePosition', [
      'projections',
      'mousePosition',
      'selectedProjection',
    ]),
    tooltipMessage() {
      return 'Select a coordinate reference system'
    },
  },
  mounted() {
    this.setupModule()
  },
  methods: {
    ...mapActions('plugin/mousePosition', ['setupModule', 'selectProjection']),
  },
})
</script>

<style>
#mouse-position-tool {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 4px;
}
#projection-form {
  border-left: 2px solid #000;
}
.mouse-position-element {
  background-color: #fff;
  padding-left: 1em;
  padding-right: 1em;
}
.tooltip-wrapper:hover .tooltip__text {
  visibility: visible;
  opacity: 1;
}
</style>
