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
    @keydown.down.prevent.stop="focusFirstResult"
    @click:clear="clear"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'AddressSearchInput',
  computed: {
    ...mapGetters('plugin/addressSearch', [
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
    focusFirstResult() {
      const firstElement =
        // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/createMap
        (document.querySelector('[data-app]') as ShadowRoot).getElementById(
          'polar-plugin-address-search-results-feature-0-0'
        )
      if (firstElement) {
        firstElement.focus()
      }
    },
  },
})
</script>
