<template>
  <div>
    <v-card-title
      v-if="showInfoForActiveLayers('monument') && objektansprache"
      class="dish-gfi-title"
    >
      {{ objektansprache }}
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
            <tr v-for="item in monumentInfo('adminUnit')" :key="item[0]">
              <td class="dish-fat-cell">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
            </tr>
            <tr v-for="item in parcelInfo" :key="item[0]">
              <td class="dish-fat-cell">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
            </tr>
            <tr v-for="item in monumentInfo('objectProps')" :key="item[0]">
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
import { denkmaelerWMS, alkisWms } from '../../servicesConstants'
import {
  prepareData,
  addComposedField,
  createComposedField,
} from '../../utils/prepareGfiDataIntern'

export default Vue.extend({
  name: 'MonumentContent',
  data: () => ({
    photo: '',
    infoFieldsMonuments: {
      adminUnit: [
        { key: 'kreis_kue', label: 'Kreis' },
        { key: 'gemeinde', label: 'Gemeinde' },
      ],
      objectProps: [
        { key: 'objektid', label: 'Objektnummer' },
        { key: 'denkmalliste', label: 'Denkmalliste' },
        { key: 'einstufung', label: 'Einstufung' },
      ],
    },
    infoFieldsAdress: ['strasse', 'hausnummer', 'hausnrzusatz'],
    infoFieldsParcels: [
      { key: 'gemarkung', label: 'Gemarkung' },
      { key: 'flstkennz', label: 'Flurstückskennzeichen' },
    ],
    infoFieldsParcelNumber: ['flstnrzae', 'flstnrnen'],
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
    objektansprache(): string {
      return this.currentProperties.objektansprache
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
        this.showInfoForActiveLayers('monument') &&
        this.objectIdentifier
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
        monument: denkmaelerWMS,
      }
      const targetLayer = layerMap[topic]
      return targetLayer ? this.activeMaskIds.includes(targetLayer) : false
    },
    prepareMonumentData(
      currentProperties: Record<string, string>,
      topic: 'adminUnit' | 'objectProps'
    ): Array<string[]> {
      this.setImage()
      const tableData = prepareData(
        currentProperties,
        this.infoFieldsMonuments[topic]
      )
      if (topic === 'adminUnit') {
        const addressData = createComposedField(
          this.infoFieldsAdress,
          currentProperties,
          'Strasse'
        )
        if (addressData) addComposedField(addressData, 'Gemeinde', tableData)
      }

      return tableData
    },
    prepareParcelData(
      currentProperties: Record<string, string>
    ): Array<string[]> {
      const tableData = prepareData(currentProperties, this.infoFieldsParcels)
      const parcelNumber = createComposedField(
        this.infoFieldsParcelNumber,
        currentProperties,
        'Flurstück',
        '/'
      )
      if (parcelNumber) addComposedField(parcelNumber, 'Gemarkung', tableData)

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
    monumentInfo(topic: 'adminUnit' | 'objectProps'): Array<string[]> | null {
      if (!this.showInfoForActiveLayers('monument') || !this.objectIdentifier) {
        return null
      }
      return this.prepareMonumentData(this.currentProperties, topic)
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
