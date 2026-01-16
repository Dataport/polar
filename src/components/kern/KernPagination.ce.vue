<template>
	<nav
		v-if="pageCount > 1"
		:aria-label="$t(($) => $.pagination.wrapper, { ns: 'shared' })"
	>
		<ul>
			<li>
				<button
					class="kern-btn kern-btn--secondary"
					:disabled="currentPage <= 1"
					@click="currentPage--"
				>
					<span class="kern-icon kern-icon--arrow-back"></span>
					<span class="kern-label kern-sr-only">
						{{ $t(($) => $.pagination.previous, { ns: 'shared' }) }}
					</span>
				</button>
			</li>
			<li
				v-for="option of visibleOptions"
				:key="'dots' in option ? option.dots : option.page"
			>
				<template v-if="'dots' in option">…</template>
				<button
					v-else-if="option.page"
					class="kern-btn kern-btn--secondary"
					:class="{ active: currentPage === option.page }"
					:aria-label="
						$t(($) => $.pagination.page, { ns: 'shared', page: option.page })
					"
					@click="currentPage = option.page"
				>
					<span class="kern-label">
						{{ option.page }}
					</span>
				</button>
			</li>
			<li>
				<button
					class="kern-btn kern-btn--secondary"
					:disabled="currentPage >= pageCount"
					@click="currentPage++"
				>
					<span class="kern-icon kern-icon--arrow-forward"></span>
					<span class="kern-label kern-sr-only">
						{{ $t(($) => $.pagination.next, { ns: 'shared' }) }}
					</span>
				</button>
			</li>
		</ul>
	</nav>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'

const props = defineProps<{
	count: number
	pageSize: number
}>()

const startIndex = defineModel<number>({ required: true })
const currentPage = computed({
	get: () => startIndex.value / props.pageSize + 1,
	set: (page) => {
		startIndex.value = (page - 1) * props.pageSize
	},
})

const pageCount = computed(() => Math.ceil(props.count / props.pageSize))

watch([() => props.count, () => props.pageSize], () => {
	if (currentPage.value > pageCount.value) {
		startIndex.value = 0
	}
})

const visibleOptions = computed<({ dots: string } | { page: number })[]>(() => {
	const generatePageInterval = (start: number, end: number) =>
		new Array(end - start + 1).fill(null).map((_, idx) => ({
			page: idx + start,
		}))

	if (pageCount.value <= 7) {
		return generatePageInterval(1, pageCount.value)
	}

	if (currentPage.value < 5) {
		return [
			...generatePageInterval(1, 5),
			{ dots: 'only' },
			...generatePageInterval(pageCount.value, pageCount.value),
		]
	}

	if (currentPage.value > pageCount.value - 4) {
		return [
			...generatePageInterval(1, 1),
			{ dots: 'only' },
			...generatePageInterval(pageCount.value - 4, pageCount.value),
		]
	}

	return [
		...generatePageInterval(1, 1),
		{ dots: 'only' },
		...generatePageInterval(currentPage.value - 1, currentPage.value + 1),
		{ dots: 'only' },
		...generatePageInterval(pageCount.value, pageCount.value),
	]
})
</script>

<style scoped>
nav {
	width: 100%;
}

ul {
	width: 100%;
	display: flex;
	list-style-type: none;
	padding: 0;
	align-items: center;
	justify-content: space-between;
	gap: var(--kern-metric-space-x-small);
}

.kern-btn {
	padding: 0;
	min-width: var(--kern-metric-dimension-large);
	min-height: calc(
		var(--kern-metric-dimension-large) + var(--kern-metric-dimension-2x-small)
	);

	&:has(.kern-sr-only) {
		width: var(--kern-metric-dimension-large);
	}

	&.active {
		background-color: var(--kern-color-action-default);
		pointer-events: none;

		.kern-label {
			color: white;
		}
	}

	.kern-label {
		font-size: var(--kern-typography-font-size-static-small);
		line-height: var(--kern-typography-line-height-static-small);
	}
}
</style>
