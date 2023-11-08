<template>
  <v-card class="dish-gfi-content">
    <v-icon v-if="hasWindowSize && hasSmallWidth" class="dish-gfi-grip-icon">
      fa-grip-lines
    </v-icon>
    <v-card-actions>
      <v-btn
        v-if="exportProperty"
        class="text-none dish-export-button"
        text
        :href="exportProperty"
        target="_blank"
        :alt="$t('common:plugins.gfi.property.imageAlt')"
        :title="$t('common:plugins.gfi.property.linkTitle')"
        :aria-label="$t('common:plugins.gfi.property.export')"
        onmousedown="return false"
      >
        <v-icon small>fa-download</v-icon>
        {{ $t('common:plugins.gfi.property.export') }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        :aria-label="$t('common:plugins.gfi.header.close')"
        @click="close"
      >
        <v-icon small>fa-xmark</v-icon>
      </v-btn>
    </v-card-actions>
    <v-card-title class="dish-gfi-title" :style="`max-width: ${imgMaxWidth}`">
      {{ currentProperties.Bezeichnung }}
    </v-card-title>
    <img
      v-if="displayImage"
      :style="`max-width: ${imgMaxWidth}; min-width: max(${imgMinWidth}, 100%); pointer-events: none`"
      :src="currentProperties.Foto"
      @load="resize"
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
                :aria-label="$t('common:plugins.gfi.toggle')"
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
                @load="resize"
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
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { GeoJsonProperties } from 'geojson'
import { mapActions, mapMutations, mapGetters } from 'vuex'

type GfiIndexStep = -1 | 1

export default Vue.extend({
  name: 'DishGfiContent',
  props: {
    currentProperties: {
      type: Object as PropType<GeoJsonProperties>,
      required: true,
    },
    clientWidth: {
      type: Number,
      required: true,
    },
    exportProperty: {
      type: String,
      default: '',
    },
    showSwitchButtons: {
      type: Boolean,
      default: false,
    },
  },
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
  }),
  computed: {
    ...mapGetters(['hasSmallWidth', 'hasWindowSize']),
    ...mapGetters('plugin/gfi', [
      'windowFeatures',
      'visibleWindowFeatureIndex',
    ]),
    displayImage(): boolean {
      return this.currentProperties.Foto !== 'Kein Foto gefunden'
    },
    imgMaxWidth(): string | undefined {
      if (this.hasWindowSize && this.hasSmallWidth) {
        return '100%'
      }
      return 0.33 * this.clientWidth + 'px'
    },
    imgMinWidth(): string | undefined {
      if (this.hasWindowSize && this.hasSmallWidth) {
        return undefined
      }
      return 400 + 'px'
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
    ...mapMutations('plugin/gfi', ['setVisibleWindowFeatureIndex']),
    ...mapActions('plugin/gfi', ['close']),
    toggleSachgesamtheit() {
      this.sachgesamtheitOpen = !this.sachgesamtheitOpen
      Vue.nextTick(this.resize)
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
    resize(): void {
      window.dispatchEvent(new Event('resize'))
    },
    /** switch to next or previous feature */
    switchFeature(by: GfiIndexStep): void {
      const {
        visibleWindowFeatureIndex,
        windowFeatures,
        setVisibleWindowFeatureIndex,
      } = this
      const maxIndex = windowFeatures.length - 1
      const nextIndex = visibleWindowFeatureIndex + by
      if (nextIndex < 0) {
        setVisibleWindowFeatureIndex(windowFeatures.length - 1)
      } else if (nextIndex > maxIndex) {
        setVisibleWindowFeatureIndex(0)
      } else {
        setVisibleWindowFeatureIndex(nextIndex)
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

.dish-gfi-grip-icon {
  left: 50%;
  transition: translateX(-50%);
}

.dish-export-button .v-icon {
  margin-right: 0.4em;
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
}

.sachgesamtheit-table {
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
