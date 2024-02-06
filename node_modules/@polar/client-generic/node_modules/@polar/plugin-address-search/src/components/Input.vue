<template>
  <v-text-field
    id="polar-plugin-address-search-input"
    prepend-icon="fa-magnifying-glass"
    clearable
    :label="$t(label)"
    :placeholder="$t(placeholder)"
    :hint="$t(hint, { minLength })"
    :aria-description="$t(hint, { minLength })"
    :loading="loading"
    :value="inputValue"
    @input="input"
    @keydown.enter="abortAndRequest"
    @keydown.down.prevent.stop="
      focusFirstResult(featureListsWithCategory.length)
    "
    @click:clear="clear"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { focusFirstResult } from '../utils/focusFirstResult'

export default Vue.extend({
  name: 'AddressSearchInput',
  computed: {
    ...mapGetters('plugin/addressSearch', [
      'featureListsWithCategory',
      'label',
      'placeholder',
      'hint',
      'minLength',
      'loading',
      'inputValue',
    ]),
  },
  methods: {
    ...mapActions('plugin/addressSearch', [
      'input',
      'abortAndRequest',
      'clear',
    ]),
    focusFirstResult,
  },
})
</script>
