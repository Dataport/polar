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
      {{ `${$t('common:dish.gfiHeader')} ${objektIdentifier}` }}
    </v-card-title>
    <img
      v-if="displayImage"
      class="dish-fat-cell"
      :style="`max-width: ${imgMaxWidth}; min-width: max(${imgMinWidth}, 15%); pointer-events: none; padding: 0 32px;`"
      :src="photo"
    />
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
import { getPhoto } from '../../utils/extendGfi'

export default Vue.extend({
  name: 'DishGfiIntern',
  components: { ActionButton },
  data: () => ({
    infoFields: {
      denkmalliste: 'Denkmalliste',
      einstufung: 'Einstufung',
      kategorie: 'Kategorie',
      kreis_kue: 'Kreis',
      gemeinde: 'Gemeinde',
      objektansprache: 'Ansprache',
      zaehler: 'Zähler',
    },
    infoFieldsAdress: ['strasse', 'hausnummer', 'hausnrzusatz'],
    photo: '',
  }),
  computed: {
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', ['currentProperties']),
    objektIdentifier(): string {
      return this.currentProperties.objektid
    },
    info(): Array<string[]> {
      return this.prepareTableData(this.currentProperties)
    },
    displayImage(): boolean {
      return this.photo !== 'Kein Foto gefunden'
    },
    imgMinWidth(): string | undefined {
      if (this.hasWindowSize && this.hasSmallWidth) {
        return undefined
      }
      return 10 + 'px'
    },
    imgMaxWidth(): string | undefined {
      if (this.hasWindowSize && this.hasSmallWidth) {
        return '15%'
      }
      return 0.1 * this.clientWidth + 'px'
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
      this.setImage()
      const tableData = Object.entries(object)
        .filter(([key]) => Object.keys(this.infoFields).includes(key))
        .map(([key, value]) => [this.infoFields[key], value])

      const adressData = [
        'Strasse',
        this.infoFieldsAdress
          .map((field) => object[field])
          .filter((value) => value)
          .join(' '),
      ]
      tableData.push(adressData)

      return tableData
    },
    async setImage() {
      this.photo = await getPhoto(this.objektIdentifier)
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
  padding: 0 32px;
  font-size: 1em;
  font-weight: bolder;
  word-break: break-word;
}
</style>
