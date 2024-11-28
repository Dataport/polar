<template>
  <div>
    <v-card-title
      v-if="showInfoForActiveLayers('monument') && objectIdentifier"
      class="dish-gfi-title"
    >
      {{ `${$t('common:dish.gfiHeader')} ${objectIdentifier}` }}
    </v-card-title>
    <img
      v-if="displayImage"
      class="dish-fat-cell"
      :style="`max-width: ${imgMaxWidth}; min-width: max(${imgMinWidth}, 15%); pointer-events: none; padding: 0 32px;`"
      :src="photo"
    />
    <v-card-text id="dish-monument-info">
      <v-simple-table dense>
        <template #default>
          <tbody>
            <tr v-for="item in monumentInfo" :key="item[0]">
              <td class="dish-fat-cell">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
            </tr>
            <tr v-for="item in parcelInfo" :key="item[0]">
              <td class="dish-fat-cell">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { getPhoto } from '../../utils/extendGfi'
import { denkmaelerWmsIntern } from '../../servicesIntern'
import { alkisWms } from '../../services'

export default Vue.extend({
  name: 'MonumentContent',
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
    parcelInfoFields: {
      gemarkung: 'Gemarkung',
      flstkennz: 'Flurstückskennzeichen',
    },
    infoFieldsFlurstueck: ['flstnrzae', 'flstnrnen'],
  }),
  computed: {
    ...mapGetters([
      'clientWidth',
      'hasSmallWidth',
      'hasWindowSize',
      'configuration',
    ]),
    ...mapGetters('plugin/layerChooser', ['activeMaskIds']),
    ...mapGetters('plugin/gfi', ['currentProperties', 'windowFeatures']),
    objectIdentifier(): string {
      return this.currentProperties.objektid
    },
    monumentInfo(): Array<string[]> | null {
      if (!this.showInfoForActiveLayers('monument')) return null
      return this.prepareMonumentData(this.currentProperties)
    },
    parcelInfo(): Array<string[]> | null {
      if (!this.showInfoForActiveLayers('alkis')) return null
      return this.prepareParcelData(
        this.windowFeatures[this.windowFeatures.length - 1]
      )
    },
    displayImage(): boolean {
      return (
        this.photo !== 'Kein Foto gefunden' &&
        this.showInfoForActiveLayers('monument')
      )
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
      return 0.2 * this.clientWidth + 'px'
    },
  },
  methods: {
    ...mapMutations('plugin/gfi', ['setVisibleWindowFeatureIndex']),
    ...mapActions('plugin/gfi', ['close']),
    showInfoForActiveLayers(topic: 'alkis' | 'monument') {
      const layerMap = {
        alkis: alkisWms,
        monument: denkmaelerWmsIntern,
      }
      const targetLayer = layerMap[topic]
      return targetLayer ? this.activeMaskIds.includes(targetLayer) : false
    },
    prepareMonumentData(object: Record<string, string>): Array<string[]> {
      this.setImage()
      const tableData = Object.entries(object)
        .filter(([key]) => Object.keys(this.infoFields).includes(key))
        .map(([key, value]) => [this.infoFields[key], value])

      const address = this.infoFieldsAdress
        .map((field) => object[field])
        .filter((value) => value)
        .join(' ')
      const addressData = ['Strasse', address]
      if (address && address.trim() !== '') tableData.push(addressData)

      return tableData
    },
    prepareParcelData(object: Record<string, string>): Array<string[]> {
      const tableData = Object.entries(object)
        .filter(([key]) => Object.keys(this.parcelInfoFields).includes(key))
        .map(([key, value]) => [this.parcelInfoFields[key], value])

      const flurStueck = this.infoFieldsFlurstueck
        .map((field) => object[field])
        .filter((value) => value)
        .join(' / ')

      const flurStueckData = ['Flurstück', flurStueck]

      if (flurStueck && flurStueck.trim() !== '') tableData.push(flurStueckData)

      return tableData
    },
    async setImage() {
      try {
        this.photo = await getPhoto(
          this.objectIdentifier,
          `${this.configuration.gfi.internalHost}/TitelBilder/`
        )
      } catch (error) {
        console.error('Error loading image:', error)
        this.photo = ''
      }
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
