<template>
  <v-card v-if="info.length > 0 && currentProperties" class="bgw-gfi-content">
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
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
            <td>{{ $t(item[0]) }}</td>
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
  computed: {
    ...mapGetters([
      'map',
      'configuration',
      'selected',
      'hasSmallWidth',
      'hasWindowSize',
    ]),
    ...mapGetters('plugin/gfi', ['currentProperties']),
    ...mapGetters('bgw', ['info']),
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
