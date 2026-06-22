<template>
	<v-scroll-x-reverse-transition>
		<v-card id="polar-plugin-routing-card">
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

export default Vue.extend({
	name: 'PolarRouting',
	components: {
		RoutingDetails,
	},
	computed: {
		...mapGetters('plugin/routing', ['routingResponseData']),
	},
	methods: {
		...mapActions('plugin/routing', ['reset']),
		...mapMutations('plugin/routing', ['updateShowSteps']),
	},
})
</script>

<style lang="scss" scoped>
#polar-plugin-routing-card {
	/* TODO: Check if some of this css is needed */
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: space-between;
	padding-left: 20px;
	padding-right: 20px;
	padding-bottom: 20px;
	min-width: 360px;

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
