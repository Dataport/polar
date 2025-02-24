<template>
  <SharedHints :main-title="mainTitle" :title="title" :sub-title="subTitle">
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
      des Bundeslandes Schleswig-Holstein gesetzlich geschützt, und
      nachrichtlich in ein Verzeichnis, die sogenannte Denkmalliste,
      aufzunehmen. Über die Aufnahme in die Denkmalliste werden die
      Eigentümerinnen und Eigentümer des Kulturdenkmals schriftlich
      benachrichtigt. Die Denkmalliste ist zu keinem Zeitpunkt abschließend,
      sondern wird ständig überprüft, ergänzt und bereinigt. Die
      Denkmaleigenschaft ist nicht von der Eintragung in die Denkmalliste, oder
      von der Darstellung in der Denkmalkarte, abhängig. Auch Objekte, die nicht
      hier verzeichnet sind, können als Kulturdenkmale kraft Gesetz (Ipsa Lege)
      geschützt sein, wenn sie die gesetzlichen Kriterien für die
      Denkmaleigenschaft erfüllen.
    </v-card-text>
    <v-card-text>
      Alle nach dem alten Denkmalschutzgesetz, das bis Anfang 2015 gültig war,
      in das ehemalige Denkmalbuch eingetragenen Kulturdenkmale wurden gemäß
      Paragraph 24 des neuen, seit Anfang 2015 gültigen Denkmalschutzgesetzes
      unmittelbar und unverändert in die Denkmalliste überführt. Die textlichen
      Detailinformationen, und wenn damit zusammenhängend, gegebenenfalls auch
      die Kartierung, konnten hierbei bei bestimmten, einzelnen Kulturdenkmalen
      noch nicht vollständig überprüft, und wo erforderlich angepasst werden.
      Deswegen steht in bestimmten, einzelnen Fällen noch „Alteintragung
      (Aktualisierung vorgesehen)“ in den textlichen Detailinformationen zum
      Denkmal. Es handelt sich aber gleichwohl förmlich und regulär um
      Kulturdenkmale.
    </v-card-text>
    <v-card-text>
      In der Denkmalkarte werden Kulturdenkmale in der Zuständigkeit des
      Landesamtes für Denkmalpflege Schleswig-Holstein, mit Sitz in der
      Landeshauptstadt Kiel (Baudenkmale, Gründenkmale, Schutzzonen vom Typ
      Denkmalbereich), dargestellt. Eine Information über diese Kulturdenkmale
      nach vielfältigen, detaillierten Suchkriterien ist ebenfalls auch möglich
      in der
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/Kulturdenkmale/Datenbank/_documents/Datenbankrecherche.html?nn=a8a8214e-5b2b-4bbb-a5f6-df970a6e82e5"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Datenbankrecherche
        </span>
      </a>
      des Landesamtes. Archäologische Denkmale (Bodendenkmale), einschließlich
      der UNESCO Welterbestätte „Haithabu-Danewerk“, werden vom
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/ALSH/alsh_node.html"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Archäologischen
        </span>
        Landesamt Schleswig-Holstein
      </a>
      mit Sitz in der historischen Residenzstadt Schleswig betreut.
      Archäologische Denkmale und Interessensgebiete sind auch direkt in der
      Karte suchbar im
      <a
        class="modal-link"
        href="https://danord.gdi-sh.de/viewer/resources/apps/ArchaeologieSH/index.html?lang=de#/"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Archäologie-Atlas
        </span>
        SH.
      </a>
      Für die Kulturdenkmale in der Hansestadt Lübeck, mit der dort gelegenen
      UNESCO Welterbestätte „Lübecker Altstadt“, hat der Bereich
      <a
        class="modal-link"
        href="https://www.luebeck.de/de/stadtleben/kultur/archaeologie-und-denkmalpflege/index.html"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Archäologie
        </span>
        und Denkmalpflege
      </a>
      der Lübecker Stadtverwaltung eine gebietsbezogene Sonderzuständigkeit.
    </v-card-text>
    <v-card-text>
      Die Darstellungen in der Denkmalkarte haben informatorischen Charakter.
      Sie sind nicht rechtsverbindlich. Für tagesaktuelle, rechtsverbindliche
      Auskünfte wenden Sie sich bitte an das
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/Kontakt/kontakt_node.html"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Landesamt
        </span>
        für Denkmalpflege Schleswig-Holstein.
      </a>
    </v-card-text>
    <v-card-text>
      Die Nutzung der Denkmalkarte ersetzt nicht die förmliche Beteiligung der
      jeweils zuständigen
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/Organisation/organisation_node.html"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Denkmalbehörde
        </span>
      </a>
      in Planungs- und Genehmigungsverfahren.
    </v-card-text>
    <v-card-text>
      Das in der Denkmalkarte verfügbare Text- und Bildmaterial darf
      weiterverbreitet und bearbeitet werden unter der Bedingung, dass Urheber-
      und Rechteangaben gemacht werden, und dass bei etwaigen Abwandlungen ein
      Hinweis hierauf abgegeben wird. Eine Weiterverbreitung darf nur unter
      rechtlich gleichen Bedingungen erfolgen. Creative Commons Lizenz:
      <a
        class="modal-link"
        href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          CC
        </span>
        BY-SA.
      </a>
    </v-card-text>
    <v-card-title class="modal-title" style="font-size: 1.1rem" tag="h3">
      Hinweise zur Nutzung der Denkmalkarte
    </v-card-title>
    <v-card-text>
      Die Denkmalkarte ist für die Nutzung auf ortsgebundenen Desktop-Geräten,
      wie auch für die Nutzung auf ortsungebundenen, mobilen Endgeräten
      geeignet. Sie kann mit den gängigen Webbrowsern aufgerufen werden.
    </v-card-text>
    <v-card-text>
      Durch das seitliche Verschieben, sowie durch die durch Vergrößerung
      beziehungsweise Verkleinerung des Kartenbildes, ist das Aufsuchen eines
      einzelnen, bestimmten Denkmales möglich.
    </v-card-text>
    <v-card-text>
      Es ist außerdem eine textliche Suche nach frei wählbaren Suchbegriffen, so
      weit wie diese in den textlichen Detailinformationen zu den in der Karte
      eingetragenen Denkmalen enthalten sind, möglich (maximale Anzahl an
      angezeigten Such-Treffern: {{ maxFeatures }}).
    </v-card-text>
    <v-card-text>
      Mit einer am Kartenrand anwählbaren Spezialfunktion kann schließlich auch
      der eigene, derzeitige Standort in der Karte angezeigt werden.
    </v-card-text>
    <v-card-text>
      Die in unterschiedlichen Farben dargestellten Typen von Denkmalen
      (Baudenkmale, Gründenkmale, Schutzzonen vom Typ Denkmalbereich) können bei
      Bedarf für jeden Typ beziehungsweise jede Farbe einzeln aus- und wieder
      eingeblendet werden.
    </v-card-text>
    <v-card-text>
      Bei Anwahl eines bestimmten Denkmales wird eine textliche Kurzinformation
      hierzu, in vielen Fällen auch mitsamt einem veranschaulichenden Foto, über
      der Karte angezeigt. Über einen in den Kurzinformationen eingebetteten
      Verweis können darüber hinaus weitere textlichen Detailinformationen zu
      dem Denkmal aufgerufen werden. Die textlichen Detailinformationen, das
      Foto, und ein kleiner Lageplan aus der Denkmalkarte, können zusammen auch
      als druck- und speicherbare Datei ausgegeben werden.
    </v-card-text>
    <v-card-text>
      Wo ein Denkmal auch noch zu einer übergeordneten Denkmalgruppe gehört, und
      daher nicht nur für sich selbst stehend, sondern auch noch mal als
      Bestandteil dieser Gruppe geschützt ist, wird dies in den über der Karte
      angezeigten textlichen Kurzinformation besonders kenntlich gemacht
      (zusätzliches, unten angefügtes Aufklapp-Element, mit der Überschrift:
      Bestandteil von).
    </v-card-text>
    <v-card-text>
      Das Denkmalschutzgesetz erlaubt es in diesem Zusammenhang, Denkmalgruppen
      zwei bestimmte Typen zuzuweisen, die die Art des Zusammenhangs der
      einzelnen Bestandteile näher kennzeichnen: Mehrheiten von baulichen
      Anlagen haben einen formal-gestalterischen Zusammenhang, Sachgesamtheiten
      einen inhaltlich-funktionellen Zusammenhang. Bei der Darstellung dieser
      Gruppen (Mehrheiten oder Sachgesamtheiten) in der Karte ist dabei zu
      beachten, dass diese keinen vollständigen Schutz der von der äußeren
      Umrisslinie abgedeckten Fläche kennzeichnet, sondern als eine
      zeichnerische Einfassung zu verstehen ist, die die innerhalb liegenden
      Objekte als ein zusammenhängendes, eigenständiges Denkmal aus mehreren
      Elementen markiert.
    </v-card-text>
    <v-card-text>
      Sie haben ein Objekt nicht in der Denkmalkarte gefunden, oder Sie haben
      weitere Fragen? Dann wenden Sie sich gerne an die nachfolgende
      Kontaktadresse:
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/Kontakt/kontakt_node.html"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Landesamt
        </span>
        für Denkmalpflege Schleswig-Holstein.
      </a>
    </v-card-text>
    <v-card-text>
      Die Bereitstellung der Denkmalkarte wurde finanziert mit Mitteln des
      <a
        class="modal-link"
        href="https://www.schleswig-holstein.de/DE/landesregierung/themen/digitalisierung/digitalisierung-zukunftsthema/Digitalisierungsprogramm/digitalisierungsprogramm_node.html"
        target="_blank"
      >
        <span class="polar-unwrappable">
          <v-icon x-small color="#0089ca">fa-chevron-right</v-icon>
          Digitalisierungsprogramm
        </span>
        SH 2021/22.
      </a>
    </v-card-text>
  </SharedHints>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import SharedHints from './SharedHints.vue'

export default Vue.extend({
  name: 'DishModalHints',
  components: {
    SharedHints,
  },
  computed: {
    ...mapGetters('plugin/addressSearch', ['selectedGroup']),
    mainTitle() {
      return this.$t('plugins.dish.modal.hints.mainTitle')
    },
    title() {
      return this.$t('plugins.dish.modal.hints.title')
    },
    subTitle() {
      return this.$t('plugins.dish.modal.hints.subTitle')
    },
    maxFeatures() {
      return this.selectedGroup.find(
        (searchService) =>
          searchService.categoryId === 'categoryDenkmalsucheDishExtern'
      ).queryParameters.maxFeatures
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
