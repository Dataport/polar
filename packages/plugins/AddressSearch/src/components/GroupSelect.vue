<template>
  <v-select
    v-if="hasMultipleGroups"
    v-model="selectedItem"
    dense
    class="polar-plugin-address-search-group-select"
    :aria-label="$t('plugins.addressSearch.groupSelector')"
    :items="
      // mapping in template to guarantee update on language change
      groupSelectOptions.map(({ value, text }) => ({ value, text: $t(text) }))
    "
  >
    <div slot="selection">
      <!--
        empty node on purpose to reduce UI;
        label is shown on input element and would be a duplicate
      -->
    </div>
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  name: 'AddressSearchGroupSelect',
  computed: {
    ...mapGetters('plugin/addressSearch', [
      'selectedGroupId',
      'groupSelectOptions',
      'hasMultipleGroups',
    ]),
    selectedItem: {
      get(): string {
        return this.selectedGroupId
      },
      set(value: string): void {
        this.setSelectedGroupId(value)
      },
    },
  },
  methods: {
    ...mapActions('plugin/addressSearch', ['setSelectedGroupId']),
  },
})
</script>

<style lang="scss">
/* minimal select element UI – labeling etc. is done via
 * neighbouring input element, to which this directly relates */
.polar-plugin-address-search-group-select {
  margin-right: 4px;
  flex: 0 1 auto;

  .v-select__selections {
    width: 0;
    max-width: 0;
  }

  .v-input__append-inner {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
}

/* structurally a sibling to v-app; hence font-family is not
 * styled according to v-app choices; doing it locally until
 * configurability required */
.v-menu__content {
  font-family: sans-serif !important;
}
</style>
