<template>
	<div>
		<!-- NOTE: Adding @keydown.prevent.stop here would prevent the map movement but would also prevent the tabbing -->
		<v-select
			v-if="displayPreferences"
			v-model="selectedPreferenceItem"
			:label="$t('plugins.routing.label.preference')"
			:aria-label="$t('plugins.routing.label.preference')"
			:items="
				['recommended', 'fastest', 'shortest'].map((value) => ({
					value,
					text: $t(`plugins.routing.preference.${value}`),
				}))
			"
		/>
		<div
			v-if="displayRouteTypesToAvoid"
			class="polar-plugin-routing-route-types-to-avoid-container"
		>
			<p>{{ $t('plugins.routing.avoidRoutesTitle') }}</p>
			<div class="polar-routing-checkbox-container">
				<v-checkbox
					v-for="(routeType, i) in routeTypesToAvoidForSelectedProfile"
					:key="i"
					v-model="selectedRouteTypesToAvoidItem"
					:label="$t(translatedRouteTypeToAvoid(routeType['key']))"
					:aria-label="$t(translatedRouteTypeToAvoid(routeType['key']))"
					:value="routeType['key']"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import noop from '@repositoryname/noop'
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
	name: 'RoutingOptions',
	computed: {
		...mapGetters('plugin/routing', [
			'displayPreferences',
			'displayRouteTypesToAvoid',
			'selectableRouteTypesToAvoid',
			'selectedPreference',
			'selectedRouteTypesToAvoid',
			'selectedTravelMode',
		]),

		routeTypesToAvoidForSelectedProfile() {
			return this.selectedTravelMode === 'driving-car' ||
				this.selectedTravelMode === 'driving-hgv'
				? this.selectableRouteTypesToAvoid
				: [
						{
							key: 'ferries',
							locale: 'plugins.routing.avoidRoutes.ferries',
						},
					]
		},
		selectedPreferenceItem: {
			get(): string {
				return this.selectedPreference
			},
			set(value: string): void {
				this.setSelectedPreference(value)
			},
		},
		selectedRouteTypesToAvoidItem: {
			get(): string {
				return this.selectedRouteTypesToAvoid
			},
			set(value: string): void {
				this.setSelectedRouteTypesToAvoid(value)
			},
		},
	},
	watch: {
		selectedTravelMode() {
			this.selectedRouteTypesToAvoidItem = []
		},
	},
	methods: {
		...mapMutations('plugin/routing', [
			'setSelectedPreference',
			'setSelectedRouteTypesToAvoid',
		]),
		noop,
		translatedRouteTypeToAvoid(myKey: string) {
			return this.selectableRouteTypesToAvoid.find(
				(element) => element.key === myKey
			).locale
		},
	},
})
</script>

<style scoped lang="scss">
.polar-plugin-routing-travel-mode-container {
	display: inline grid;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	width: 100%;
	margin-bottom: 1em;

	.polar-plugin-routing-travel-mode-button {
		&:focus,
		&:hover {
			z-index: 1;
		}
	}
}

.polar-plugin-routing-route-types-to-avoid-container {
	p {
		margin: 0;
	}
	.polar-routing-checkbox-container {
		display: flex;
		flex-wrap: nowrap;
		gap: 20px;
		justify-content: space-evenly;

		.v-input {
			margin-top: 0.5em;
		}
	}
}
</style>
