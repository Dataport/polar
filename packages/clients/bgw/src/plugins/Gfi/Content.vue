<template>
  <v-card class="bgw-gfi-content">
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        :aria-label="$t('plugins.gfi.header.close')"
        @click="close(true)"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="bgw-gfi-title">
      {{ currentProperties.bgw_name }}
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <tbody>
          <tr v-for="item in info" :key="item[0]">
            <td>{{ item[0] }}</td>
            <td>{{ item[1] }}</td>
          </tr>
        </tbody>
      </v-simple-table>
      <ActionButton></ActionButton>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import ActionButton from './ActionButton.vue'

export default Vue.extend({
  name: 'BgwGfiContent',
  components: { ActionButton },
  data: () => ({
    infoFields: [
      { key: 'fid', label: 'EU-IRD' },
      { key: 'ort', label: 'Gemeinde' },
      { key: 'bgw_kreis', label: 'Kreis' },
      { key: 'bgw_gwkategory', label: 'Gewässerkategorie' },
      { key: 'bgw_laenge', label: 'geographische Länge' },
      { key: 'bgw_breite', label: 'geographische Breite' },
      { key: 'bgw_laenge_bgw', label: 'Länge Uferlinie (m)' },
      { key: 'bgw_umfeld', label: 'Umfeld (Infrastruktur)' },
    ],
  }),
  computed: {
    ...mapGetters('plugin/gfi', ['currentProperties']),
    info(): Array<string[]> {
      console.warn(this.currentProperties)
      return this.infoFields.map(({ key, label }) => [
        label,
        this.currentProperties[key],
      ])
    },
  },
  methods: {
    ...mapActions('plugin/gfi', ['close']),
  },
})
</script>

<style lang="scss" scoped>
.bgw-gfi-title {
  word-break: break-word;
  font-size: medium;
  font-weight: bold;
}
</style>
