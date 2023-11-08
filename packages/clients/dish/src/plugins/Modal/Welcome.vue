<template>
  <v-card elevation="12" class="modal-card">
    <img
      class="landesdachmarke"
      src="./landesdachmarke_denkmalpflege.jpg"
      :alt="$t('common:plugins.dish.modal.landesdachmarkeAlt')"
    />
    <v-card-title class="modal-title" tag="h1">
      {{ $t('common:plugins.dish.modal.welcome.header') }}
    </v-card-title>
    <v-card-text>
      {{ $t('common:plugins.dish.modal.welcome.p1') }}
    </v-card-text>
    <v-card-text>
      {{ $t('common:plugins.dish.modal.welcome.p2') }}
    </v-card-text>
    <v-card-text>
      {{ $t('common:plugins.dish.modal.welcome.p3') }}
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/Kontakt/kontakt_node.html"
        target="_blank"
      >
        <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
        {{ $t('common:plugins.dish.modal.welcome.link1') }}.
      </a>
    </v-card-text>
    <v-card-text>
      {{ $t('common:plugins.dish.modal.welcome.p4') }}
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/Organisation/organisation_node.html"
        target="_blank"
      >
        <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
        {{ $t('common:plugins.dish.modal.welcome.link2') }}.
      </a>
    </v-card-text>
    <v-card-actions class="modal-actions">
      <v-checkbox
        v-model="confirmed"
        color="#003064"
        :label="$t('common:plugins.dish.modal.welcome.confirmRead')"
      ></v-checkbox>
      <v-btn
        class="text-none primaryContrast--text closeButton"
        color="primary"
        :disabled="!confirmed"
        @click="closed = true"
      >
        {{ $t('common:plugins.dish.modal.welcome.closeInfo') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSetGenerator } from '@repositoryname/vuex-generators'

export default Vue.extend({
  name: 'DishModalWelcome',
  computed: {
    ...getSetGenerator('plugin/modal', ['confirmed', 'closed']),
  },
})
</script>

<style lang="scss" scoped>
.landesdachmarke {
  max-width: 300px;
  float: right;

  @media only screen and (max-width: 768px) {
    float: unset;
    width: 100%;
    display: block;
    margin-left: auto;
  }
}

.modal-card::v-deep .v-label {
  color: #003064;
  margin-right: 0.5em;
}

@media only screen and (max-width: 768px) {
  .modal-card::v-deep .modal-actions {
    flex-direction: column !important;
  }
}
.closeButton {
  // transparent border to prevent button from jumping while hover or focus
  border: solid #ffffffff;
}
</style>
