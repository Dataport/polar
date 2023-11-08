<template>
  <v-text-field
    prepend-icon="fa-magnifying-glass"
    clearable
    :label="$t(label)"
    :placeholder="$t(placeholder)"
    :hint="$t(hint, { minLength })"
    :loading="loading"
    :value="inputValue"
    @input="input"
    @keydown.enter="abortAndRequest"
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
  },
})
</script>
