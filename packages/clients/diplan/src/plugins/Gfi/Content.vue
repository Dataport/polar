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
      <v-subtitle>X layer(s)</v-subtitle>
      <v-divider vertical class="mx-2"></v-divider>
      <v-subtitle>
        X WMS Features
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon small class="mb-1" v-on="on">fa-info-circle</v-icon>
          </template>
          <span>uhhh</span>
        </v-tooltip>
      </v-subtitle>
      <v-divider vertical class="mx-2"></v-divider>
      <v-select dense hide-details label="Feature"></v-select>
    </v-card-actions>
    <v-tabs v-model="tab" class="mx-4">
      <v-tab class="text-none">Objektattribute</v-tab>
      <v-tab class="text-none">Textinhalte</v-tab>
      <v-tab class="text-none">Referenzen</v-tab>
      <v-tab class="text-none">Planattribute</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mx-4">
      <v-tab-item v-for="table in tables" :key="table">
        <v-simple-table dense>
          <template #default>
            <tbody>
              <tr v-for="row in table" :key="row[0]">
                <th>{{ row[0] }}</th>
                <td>{{ row[1] }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
    <!--
    <h4>A</h4>
    {{ JSON.stringify(currentProperties, null, 2) }}
    <h4>B</h4>
    {{ JSON.stringify(imageLoaded, null, 2) }}
    <h4>C</h4>
    {{ JSON.stringify(visibleWindowFeatureIndex, null, 2) }}
    <h4>D</h4>
    {{ JSON.stringify(windowFeatures, null, 2) }}
     -->
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'DiplanGfiContent',
  data: () => ({
    tab: 0,
    tables: {
      Objektattribute: [
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
      ],
      Textinhalte: [
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
      ],
      Referenzen: [
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
      ],
      Planattribute: [
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
        ['beschreibung', 'Text'],
      ],
    },
  }),
  computed: {
    ...mapGetters('plugin/gfi', [
      'currentProperties',
      'imageLoaded',
      'visibleWindowFeatureIndex',
      'windowFeatures',
    ]),
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
