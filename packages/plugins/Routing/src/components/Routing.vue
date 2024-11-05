<template>
  <v-scroll-x-reverse-transition>
    <v-card class="polar-routing-menu">
      <v-card-title>{{ $t('common:plugins.routing.title') }} </v-card-title>
      <v-text-field :label="$t('common:plugins.routing.startLabel')">
      </v-text-field>
      <v-text-field :label="$t('common:plugins.routing.endLabel')">
      </v-text-field>
      <v-actions>
        <v-btn>{{ $t('common:plugins.routing.resetButton') }} </v-btn>
      </v-actions>
      <v-select
        clearable
        label="common:plugins.routing.modeLabel"
        :items="$t('common:plugins.routing.travelMode')"
      ></v-select>
      <v-select
        clearable
        label="common:plugins.routing.preferenceLabel"
        :items="$t('common:plugins.routing.preference')"
      ></v-select>
      <!--
      //TODO: values definieren - wo?
      <v-radio-group
        inline
        title="common:plugins.routing.avoidRoutesTitle"
        :aria-labelledby="`polar-routing-${id}`"
        dense
        hide-details
        :value="initialValue"
        @change="changeCallback"
      >
        <v-radio
          v-for="[key, value] in Object.entries(values)"
          :key="key"
          :label="$t(value)"
          :value="key"
        ></v-radio>
      </v-radio-group>-->
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'RoutingPlugin',
  data: () => ({
    isOpen: false,
  }),
  computed: {
    ...mapGetters(['hasSmallDisplay']),
    ...mapGetters('plugin/routing', ['renderType']),
  },
  mounted() {
    this.setupModule()
  },
  methods: {
    ...mapActions('plugin/routing', ['setupModule']),
  },
})
</script>

<style>
.polar-plugin-routing-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
</style>
