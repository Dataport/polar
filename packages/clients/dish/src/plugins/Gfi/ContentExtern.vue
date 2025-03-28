<template>
  <SharedContent>
    <v-card-title class="dish-gfi-title" :style="`max-width: ${imgMaxWidth}`">
      {{ currentProperties.Bezeichnung }}
    </v-card-title>
    <img
      v-if="displayImage && calculatedWidth > minWidth"
      :style="`max-width: ${imgMaxWidth}; min-width: max(${imgMinWidth}, 100%); pointer-events: none`"
      :src="currentProperties.Foto"
      @load="resizeImage"
    />
    <v-card-text>
      <v-simple-table dense>
        <template #default>
          <tbody>
            <tr v-for="item in info" :key="item[0]">
              <td class="dish-fat-cell">{{ item[0] }}</td>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <td v-html="item[1]"></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-text v-if="Boolean(sachgesamtheit)" class="dish-gfi-sachgesamtheit">
      <v-subheader class="dish-fat-cell"> Bestandteil von </v-subheader>
      <v-simple-table
        :class="{
          'sachgesamtheit-table': true,
          'dish-show-border': sachgesamtheitOpen,
        }"
        dense
      >
        <thead>
          <tr>
            <th>
              <v-btn
                icon
                x-small
                :aria-label="$t('plugins.gfi.toggle')"
                @click="toggleSachgesamtheit"
              >
                <v-icon small>
                  fa-chevron-{{ sachgesamtheitOpen ? 'up' : 'down' }}
                </v-icon>
              </v-btn>
            </th>
            <th style="font-weight: initial; font-size: inherit">
              {{ sachgesamtheitName[0] }}
              <br />
              {{ sachgesamtheitName[1] }}
            </th>
          </tr>
        </thead>
        <tbody
          :class="{
            'sachgesamtheit-body': true,
            'sachgesamtheit-body-visible': sachgesamtheitOpen,
          }"
        >
          <tr v-if="sachgesamtheitDisplayImage">
            <td colspan="2">
              <img
                :style="`max-width: ${imgMaxWidth}; min-width: max(${imgMinWidth}, 100%); pointer-events: none`"
                :src="sachgesamtheit.properties.Foto"
                @load="resizeImage"
              />
            </td>
          </tr>
          <tr v-for="item in sachgesamtheitInfo" :key="item.name">
            <td class="dish-fat-cell">{{ item[0] }}</td>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <td v-html="item[1]"></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </SharedContent>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapGetters } from 'vuex'
import SharedContent from './SharedContent.vue'

export default Vue.extend({
  name: 'DishGfiExtern',
  components: { SharedContent },
  data: () => ({
    infoFields: [
      'Kreis',
      'Gemeinde',
      'PLZ',
      'Straße',
      'Objektnummer',
      'Detailinformationen',
    ],
    sachgesamtheitOpen: false,
    minWidth: 400,
  }),
  computed: {
    ...mapGetters('plugin/gfi', ['currentProperties', 'imageLoaded']),
    ...mapGetters(['clientWidth', 'hasSmallWidth', 'hasWindowSize']),
    displayImage(): boolean {
      return this.currentProperties.Foto !== 'Kein Foto gefunden'
    },
    calculatedWidth(): number {
      return 0.33 * this.clientWidth
    },
    imgMaxWidth(): string | undefined {
      if (this.hasWindowSize && this.hasSmallWidth) {
        return '100%'
      }
      return this.calculatedWidth + 'px'
    },
    imgMinWidth(): string | undefined {
      if (this.hasWindowSize && this.hasSmallWidth) {
        return undefined
      }
      return this.minWidth + 'px'
    },
    info(): Array<string[]> {
      return this.prepareTableData(this.currentProperties)
    },
    sachgesamtheit(): object | undefined {
      return this.currentProperties.sachgesamtheit
    },
    sachgesamtheitName(): string[] {
      const { Bezeichnung } = this.sachgesamtheit.properties
      const separatorIndex = Bezeichnung.indexOf(':')
      return [
        Bezeichnung.substring(0, separatorIndex + 1).trim(),
        Bezeichnung.substring(separatorIndex + 1).trim(),
      ]
    },
    sachgesamtheitInfo(): Array<string[]> {
      return this.prepareTableData(this.sachgesamtheit.properties)
    },
    sachgesamtheitDisplayImage(): boolean {
      return this.sachgesamtheit.properties.Foto !== 'Kein Foto gefunden'
    },
  },
  methods: {
    ...mapMutations('plugin/gfi', ['setImageLoaded']),
    toggleSachgesamtheit() {
      this.sachgesamtheitOpen = !this.sachgesamtheitOpen
      Vue.nextTick(() => window.dispatchEvent(new Event('resize')))
    },
    prepareTableData(object: Record<string, string>): Array<string[]> {
      return Object.entries(object)
        .filter(([key]) => this.infoFields.includes(key))
        .map(([key, value]) => [
          key,
          key === 'Detailinformationen'
            ? `<a href="${value}" target="_blank">Link</a>`
            : value,
        ])
    },
    resizeImage(e: Event) {
      if ((e.currentTarget as HTMLImageElement).complete && !this.imageLoaded) {
        this.setImageLoaded(true)
        window.dispatchEvent(new Event('resize'))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
$sachgesamtheit-highlight: #1eae9c;
$sachgesamtheit-background: #e4f5f3;

* {
  color: #003064 !important;
}

.dish-fat-cell {
  font-weight: bolder;
}

.dish-gfi-title {
  word-break: break-word;
}

.sachgesamtheit-table {
  background: $sachgesamtheit-background;
  border-left: 4px solid $sachgesamtheit-highlight;
  padding: 0 16px;

  th,
  td {
    border: 0 !important;
    padding: 0 !important;
  }
  &.dish-show-border th {
    border-bottom: thin solid $sachgesamtheit-highlight !important;
  }
}

.sachgesamtheit-body {
  visibility: collapse;
}

.sachgesamtheit-body-visible {
  visibility: inherit;
}
</style>
