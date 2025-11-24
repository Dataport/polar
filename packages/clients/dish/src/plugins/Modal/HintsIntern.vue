<template>
  <SharedHints :main-title="mainTitle" :title="title">
    <v-card-text>
      Für die Mitarbeiterinnen und Mitarbeiter der Unteren Denkmalschutzbehörden
      der Kreise und kreisfreien Städte Schleswig-Holsteins werden ab Juni 2022
      von Seiten des Landesamtes für Denkmalpflege Schleswig-Holstein die
      technischen Voraussetzungen geschaffen, um über das Internet Zugriff auf
      das bislang amtsinterne Denkmalinformationssystem Schleswig-Holstein
      (DISH) zu erhalten.
    </v-card-text>
    <v-card-text>
      Die Unteren Denkmalschutzbehörden der Kreise und kreisfreien Städte
      erhalten ausschließlich Leserechte unter Berücksichtigung ihrer
      Zuständigkeit und des Datenschutzes.
    </v-card-text>
    <v-card-title class="modal-title" style="font-size: 1.1rem" tag="h3">
      Nutzungsregeln
    </v-card-title>
    <v-card-text>
      Es gelten folgende Nutzungsregeln für den Umgang mit den Informationen in
      DISH:
    </v-card-text>
    <v-card-text>
      <strong>1. Zugriff auf geschützte Endgeräte</strong><br />
      Der Zugriff auf die URL
      <a
        class="modal-link"
        href="https://wdishpw002.lr.landsh.de/Content/Default.aspxx"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          https://wdishpw002.lr.landsh.de/Content/Default.aspxx
        </span>
      </a>
      darf nur auf Endgeräten erfolgen, die von den IT-Verantwortlichen der
      jeweiligen Kreisverwaltung bzw. der Verwaltung der kreisfreien Stadt
      gemanagt werden.
    </v-card-text>
    <v-card-text>
      <strong>2. Personengebundene Zugriffsrechte</strong><br />
      Die Zugriffsrechte sind personengebunden. Das heißt, dass die Kennwörter
      nicht an Dritte weitergeleitet werden dürfen und nicht von Dritten genutzt
      werden dürfen.
    </v-card-text>
    <v-card-text>
      <strong>3. Behördeninterner Bedarf</strong><br />
      Die Informationen in DISH dienen ausschließlich dem behördeninternen
      Bedarf. Sie können unter anderem dafür genutzt werden, um die Listen
      (Kulturdenkmale, Objekte mit Kontrollbedarf) zum internen Gebrauch zu
      erstellen, die bisher von Seiten des Landesamtes für Denkmalpflege an die
      Unteren Denkmalschutzbehörden versendet wurden.
    </v-card-text>
    <v-card-text>
      <strong>4. Keine Auskünfte an Dritte</strong><br />
      Gegenüber Dritten dürfen auf Basis der Daten in DISH keine Auskünfte
      gegeben werden.
    </v-card-text>
    <v-card-text>
      <strong>5. Verweis bei Fragen zum Denkmalwert</strong><br />
      Bei Fragen zum Denkmalwert eines Objektes muss auf die zuständige
      Mitarbeiterin oder den zuständigen Mitarbeiter der Inventarisation des
      Landesamtes für Denkmalpflege verwiesen werden.
    </v-card-text>
  </SharedHints>
</template>

<script lang="ts">
import Vue from 'vue'
import SharedHints from './SharedHints.vue'

export default Vue.extend({
  name: 'DishModalHintsIntern',
  components: {
    SharedHints,
  },
  computed: {
    mainTitle() {
      return 'plugins.dish.modal.hintsIntern.mainTitle'
    },
    title() {
      return 'plugins.dish.modal.hintsIntern.title'
    },
  },
})
</script>

<style lang="scss" scoped>
.polar-unwrappable {
  white-space: nowrap;
}
.modal-link {
  display: inline !important;
}
</style>
