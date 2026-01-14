<template>
	<div class="polar-plugin-footer-wrapper">
		<!-- TODO: Add Polar-Repo-Icon as last entry -->
		<ul>
			<li v-for="(entry, index) in leftEntries" :key="index">
				<component :is="entry.component" />
			</li>
		</ul>
		<ul>
			<li v-for="(entry, index) in rightEntries" :key="index">
				<component :is="entry.component" />
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useFooterStore } from '../store'

const { leftEntries, rightEntries } = storeToRefs(useFooterStore())
</script>

<style scoped>
.polar-plugin-footer-wrapper {
	position: absolute;
	bottom: 0;
	display: flex;
	width: 100%;
	height: var(--kern-metric-space-x-large);
	padding: var(--kern-metric-space-x-small) var(--kern-metric-space-x-small)
		var(--kern-metric-space-x-small) var(--kern-metric-space-small);
	justify-content: space-between;
	align-items: center;
	flex-shrink: 0;

	background: var(--kern-color-layout-background-hued);
	box-shadow:
		0 1px 1px 0 rgba(53, 57, 86, 0.16),
		0 1px 2px 0 rgba(53, 57, 86, 0.25),
		0 1px 6px 0 rgba(110, 117, 151, 0.25);
	border-radius: 0 0 var(--kern-metric-border-radius-large)
		var(--kern-metric-border-radius-large);

	ul {
		display: flex;
		align-items: center;
		gap: var(--kern-metric-space-small);
		padding: 0;

		li {
			list-style: none;
		}
	}
}
</style>
