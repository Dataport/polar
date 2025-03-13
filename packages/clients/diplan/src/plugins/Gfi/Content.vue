<template>
  <v-card class="diplan-gfi-content">
    <v-card-actions>
      <v-card-title class="py-0">Dienstname</v-card-title>
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
    <v-divider class="mx-4" />
    <v-card-actions class="mx-4">
      <v-card-subtitle>{{ features.length }} Layer</v-card-subtitle>
      <v-divider vertical class="mx-2"></v-divider>
      <v-card-subtitle>
        {{ featureInformation.xplanwms.length }} WMS-Features
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon small class="mb-1" v-on="on">fa-info-circle</v-icon>
          </template>
          <span
            >Die Anzahl der aufgeführten WMS-Features ist abhängig vom
            Klickradius und der Zoomstufe.</span
          >
        </v-tooltip>
      </v-card-subtitle>
      <v-divider vertical class="mx-2"></v-divider>
      <v-select
        v-model="feature"
        :items="featureItems"
        return-object
        dense
        hide-details
        label="Feature"
      ></v-select>
    </v-card-actions>
    <v-tabs v-model="tab" class="mx-4">
      <v-tab
        v-for="table of Object.keys(tables)"
        :key="table"
        class="text-none"
        >{{ table }}</v-tab
      >
    </v-tabs>
    <v-tabs-items v-model="tab" class="mx-4">
      <v-tab-item v-for="[key, filter] of Object.entries(tables)" :key="key">
        <v-simple-table v-if="getProperties(filter).length" dense>
          <template #default>
            <tbody>
              <tr
                v-for="{ label, value } of getProperties(filter)"
                :key="key + label"
              >
                <th>{{ label }}</th>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <b v-else>Keine Attribute vorhanden!</b>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default Vue.extend({
  name: 'DiplanGfiContent',
  data: () => ({
    tab: 0,
    tables: {
      Objektattribute: (key) =>
        ![
          'position',
          'texte',
          'refTextInhalt',
          'externeReferenz',
          'xpPlanName',
          'planArtWert',
          'xpPlanType',
          'xpVersion',
          'xplanMgrPlanId',
          'wmsSortDate',
          'begruendungsTexte',
          'bereich',
          'gehoertZuPlan',
          'gehoertZuBereich',
          'dientZurDarstellungVon',
          'wirdDargestelltDurch',
          'gehoertZuBP_Bereich',
          'gehoertZuFP_Bereich',
          'spezExterneReferenz',
          'refScan',
          'planinhalt',
          'praesentationsobjekt',
        ].includes(key),
      Textinhalte: (key) =>
        ['texte', 'refTextInhalt', 'begruendungsTexte'].includes(key),
      Referenzen: (key) =>
        [
          'externeReferenz',
          'spezExterneReferenz',
          'bereich',
          'gehoertZuPlan',
          'gehoertZuBereich',
          'dientZurDarstellungVon',
          'wirdDargestelltDurch',
          'gehoertZuBP_Bereich',
          'gehoertZuFP_Bereich',
          'refScan',
          'planinhalt',
          'praesentationsobjekt',
        ].includes(key),
      Planattribute: (key) =>
        ['xpPlanName', 'xpPlanType', 'xpVersion', 'wmsSortDate'].includes(key),
    },
    feature: null,
  }),
  computed: {
    ...mapGetters('plugin/gfi', [
      'imageLoaded',
      'visibleWindowFeatureIndex',
      'windowFeatures',
      'featureInformation',
      'gfiConfiguration',
    ]),
    features() {
      return [
        ...this.featureInformation.xplanwms.filter((_, idx) => idx === 0),
        ...this.featureInformation.xplanwfs,
      ].reverse()
    },
    featureItems() {
      return [...this.featureInformation.xplanwms]
        .reverse()
        .map((feature, idx) => ({
          ...feature,
          text: `${
            feature.properties?.xpPlanName
          } - ${feature.properties.gmlId.substring(
            6,
            feature.properties.gmlId.length - 37
          )}(${idx + 1})`,
        }))
    },
  },
  mounted() {
    this.feature = this.featureItems[0]
  },
  methods: {
    ...mapMutations('plugin/gfi', ['setPage']),
    ...mapActions('plugin/gfi', ['close']),
    getProperties(filter) {
      return Object.entries(this.feature?.properties || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .filter(([label]) => filter(label))
        .map(([label, value]) => ({ label, value }))
    },
  },
})
</script>

<style lang="scss" scoped>
.diplan-gfi-content {
  z-index: 1;
  margin-top: 1em;
}

.diplan-fat-cell {
  font-weight: 700;
}
</style>
