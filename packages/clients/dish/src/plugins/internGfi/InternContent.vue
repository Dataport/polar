<template>
  <v-card class="dish-gfi-content">
    <v-card-actions v-if="!hasWindowSize || !hasSmallWidth">
      <ActionButton></ActionButton>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        :aria-label="$t('common:plugins.gfi.header.close')"
        @click="close(true)"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="dish-gfi-title">
      {{ `${$t('common:dish.gfiHeader')} ${tableHead}` }}
    </v-card-title>
    <v-card-text>
      <v-simple-table dense>
        <template #default>
          <tbody>
            <tr v-for="item in info" :key="item[0]">
              <td class="dish-fat-cell">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import ActionButton from '../Gfi/ActionButton.vue'

export default Vue.extend({
  name: 'DishGfiIntern',
  components: { ActionButton },
  data: () => ({
    infoFields: {
      denkmallis: 'Denkmalliste',
      einstufung: 'Einstufung',
      kategorie: 'Kategorie',
      kreis_kue: 'Kreis',
    },
  }),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', ['currentProperties']),
    tableHead(): string {
      return this.currentProperties.objektid
    },
    info(): Array<string[]> {
      return this.prepareTableData(this.currentProperties)
    },
  },
  mounted() {
    if (this.hasWindowSize && this.hasSmallWidth) {
      this.setMoveHandleActionButton({
        component: ActionButton,
      })
    }
  },
  beforeDestroy() {
    this.setMoveHandleActionButton(null)
  },
  methods: {
    ...mapMutations(['setMoveHandleActionButton']),
    ...mapActions('plugin/gfi', ['close']),
    prepareTableData(object: Record<string, string>): Array<string[]> {
      return Object.entries(object)
        .filter(([key]) => Object.keys(this.infoFields).includes(key))
        .map(([key, value]) => [this.infoFields[key], value])
    },
  },
})
</script>

<style lang="scss" scoped>
* {
  color: #003064 !important;
}

.dish-fat-cell {
  font-weight: bolder;
}

.dish-gfi-title {
  margin: 0;
  padding: 0;
  text-align: center;
  display: block;
  font-size: 1em;
  font-weight: bolder;
  word-break: break-word;
}
</style>
