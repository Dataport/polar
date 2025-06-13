<template>
  <v-scroll-x-reverse-transition>
    <v-card id="polar-plugin-routing-card">
      <v-card-title>{{ $t('plugins.routing.title') }}</v-card-title>
      <div
        v-for="(_, index) in route"
        :key="`polar-plugin-routing-route-container-${index}`"
        class="polar-plugin-routing-route-container"
      >
        <v-text-field
          :id="`polar-plugin-routing-input-${index}`"
          v-model="route[index]"
          class="polar-plugin-routing-input"
          :label="$t(getRouteLabel(index))"
          :aria-label="
            $t('plugins.routing.label.aria', {
              position: $t(getRouteLabel(index)),
            })
          "
          @focus="(e) => focusInput(e, index)"
        />
        <div>
          <v-btn
            icon
            small
            :disabled="addWaypointButtonDisabled"
            :aria-label="$t('plugins.routing.label.add')"
            @click="setRoute({ index })"
          >
            <v-icon small>fa-plus</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            :disabled="route.length === 2"
            :aria-label="$t('plugins.routing.label.remove')"
            @click="setRoute({ index, remove: true })"
          >
            <v-icon small>fa-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <RoutingOptions />
      <div id="polar-plugin-routing-button-group">
        <v-btn :aria-label="$t('plugins.routing.resetButton')" @click="reset">
          {{ $t('plugins.routing.resetButton') }}
        </v-btn>
        <v-btn
          :aria-label="$t('plugins.routing.routeDetails')"
          :disabled="Object.keys(routingResponseData).length === 0"
          @click="updateShowSteps"
        >
          {{ $t('plugins.routing.routeDetails') }}
        </v-btn>
      </div>
      <RoutingDetails />
    </v-card>
  </v-scroll-x-reverse-transition>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import RoutingDetails from './RoutingDetails.vue'
import RoutingOptions from './RoutingOptions.vue'

export default Vue.extend({
  name: 'PolarRouting',
  components: {
    RoutingDetails,
    RoutingOptions,
  },
  computed: {
    ...mapGetters('plugin/routing', [
      'currentlyFocusedInput',
      'route',
      'routingResponseData',
      'searchResults',
      'selectedPreference',
      'selectedRouteTypesToAvoid',
      'selectedTravelMode',
    ]),
    addWaypointButtonDisabled() {
      return (
        this.route.filter((part) => Boolean(part.length)).length <
        this.route.length - 1
      )
    },
    routeIncomplete() {
      return this.route.some((part) => part.length === 0)
    },
  },
  watch: {
    route() {
      if (!this.routeIncomplete) {
        this.getRoute()
      }
    },
    selectedRouteTypesToAvoid() {
      if (!this.routeIncomplete) {
        this.getRoute()
      }
    },
    selectedPreference() {
      if (!this.routeIncomplete) {
        this.getRoute()
      }
    },
  },
  beforeDestroy() {
    this.setCurrentlyFocusedInput(-1)
  },
  methods: {
    ...mapActions('plugin/routing', [
      'getRoute',
      'reset',
      'setCurrentlyFocusedInput',
    ]),
    ...mapMutations('plugin/routing', ['setRoute', 'updateShowSteps']),
    focusInput(e: FocusEvent, index: number) {
      const previousIndex = this.currentlyFocusedInput
      if (previousIndex !== -1) {
        // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/Maaceeprt
        ;(document.querySelector('[data-app]') as ShadowRoot)
          .getElementById(`polar-plugin-routing-input-${previousIndex}`)
          ?.classList.remove('polar-plugin-routing-input-focused')
      }
      e.currentTarget.classList.add('polar-plugin-routing-input-focused')
      this.setCurrentlyFocusedInput(index)
    },
    getRouteLabel(index: number) {
      return `plugins.routing.label.${
        index === 0
          ? 'start'
          : index === this.route.length - 1
          ? 'end'
          : 'middle'
      }`
    },
  },
})
</script>

<style lang="scss">
.polar-plugin-routing-input {
  border: solid transparent;
}

.polar-plugin-routing-input-focused {
  border: solid var(--polar-primary);
}
</style>

<style lang="scss" scoped>
#polar-plugin-routing-card {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  min-width: 360px;

  .polar-plugin-routing-route-container {
    display: flex;
    align-items: center;
    gap: 1.5em;
  }

  #polar-plugin-routing-button-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;

    .v-btn {
      width: 47.5%;
    }
  }
}
</style>
