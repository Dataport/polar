<template>
  <v-card elevation="12" class="modal-card">
    <v-btn icon class="modal-info-close-button" @click="closed = true">
      <v-icon>fa-xmark</v-icon>
    </v-btn>
    <v-card-title class="modal-title" tag="h1">
      Denkmalkarte Schleswig-Holstein INTERN
    </v-card-title>
    <v-card-title class="modal-title" style="font-size: 1.3rem" tag="h2">
      Benutzungshinweise
    </v-card-title>
    <v-card-title class="modal-title" style="font-size: 1.1rem" tag="h3">
      Allgemeine Informationen
    </v-card-title>
    <v-card-text>
      Kulturdenkmale sind nach dem
      <a
        class="modal-link"
        href="https://www.gesetze-rechtsprechung.sh.juris.de/bssh/document/jlr-DSchGSH2015rahmen"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Denkmalschutzgesetz
        </span>
      </a>
      interne Benutzerhinweise
    </v-card-text>
    <v-card-text> interne Benutzerhinweise </v-card-text>
    <v-card-actions class="modal-actions">
      <v-btn
        class="text-none primaryContrast--text"
        color="primary"
        @click="closed = true"
      >
        Textfenster schließen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { getSetGenerator } from '@repositoryname/vuex-generators'

export default Vue.extend({
  name: 'DishModalHints',
  computed: {
    ...getSetGenerator('plugin/modal', ['closed']),
    ...mapGetters('plugin/addressSearch', ['selectedGroup']),
    maxFeatures() {
      const search = this.selectedGroup.find(
        (searchService) =>
          searchService.categoryId === 'categoryDenkmalsucheDish'
      )
      if (search) return search.queryParameters.maxFeatures
      return ''
    },
  },
})
</script>
<style lang="scss" scoped>
.polar-unwrappable {
  white-space: nowrap;
}
.modal-info-close-button {
  position: absolute;
  top: 2em;
  right: 2em;
}
.modal-link {
  display: inline !important;
}
.modal-actions {
  justify-content: end !important;
  @media only screen and (max-width: 768px) {
    justify-content: center !important;
  }
}
</style>
