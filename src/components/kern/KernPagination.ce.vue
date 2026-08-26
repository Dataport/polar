<template>
	<p
		class="kern-subline kern-subline--small"
		:class="{ 'polar-subline--real-small': pageCount <= 1 }"
	>
		{{
			$t(($) => $.pagination.entries, {
				ns: 'shared',
				start: startIndex + 1,
				end: Math.min(count, startIndex + pageSize),
				total: count,
			})
		}}
	</p>
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
					<span class="kern-icon kern-icon--arrow-back" />
					<span class="kern-label kern-sr-only">
						{{ $t(($) => $.pagination.previous, { ns: 'shared' }) }}
					</span>
				</button>
			</li>
			<li
				v-for="option of visibleOptions"
				:key="'dots' in option ? option.dots : option.page"
				:class="{ dots: 'dots' in option }"
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
					<span class="kern-icon kern-icon--arrow-forward" />
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

watch(
	[() => props.count, () => props.pageSize],
	() => {
		if (currentPage.value > pageCount.value) {
			startIndex.value = 0
		}
	},
	{ immediate: true }
)

const visibleOptions = computed(() => {
	const generatePageInterval = (start: number, end: number) =>
		new Array(end - start + 1).fill(null).map((_, index) => ({
			page: index + start,
		}))

	if (pageCount.value <= 7) {
		return generatePageInterval(1, pageCount.value)
	}

	if (currentPage.value <= 2 || currentPage.value >= pageCount.value - 1) {
		return [
			...generatePageInterval(1, 3),
			{ dots: 'center' },
			...generatePageInterval(pageCount.value - 2, pageCount.value),
		]
	}

	if (currentPage.value < 5) {
		return [
			...generatePageInterval(1, 5),
			{ dots: 'late' },
			...generatePageInterval(pageCount.value, pageCount.value),
		]
	}

	if (currentPage.value > pageCount.value - 4) {
		return [
			...generatePageInterval(1, 1),
			{ dots: 'early' },
			...generatePageInterval(pageCount.value - 4, pageCount.value),
		]
	}

	return [
		...generatePageInterval(1, 1),
		{ dots: 'early' },
		...generatePageInterval(currentPage.value - 1, currentPage.value + 1),
		{ dots: 'late' },
		...generatePageInterval(pageCount.value, pageCount.value),
	]
})
</script>

<style scoped>
.polar-subline--real-small {
	padding-bottom: 0;
}

ul {
	display: flex;
	list-style-type: none;
	padding: 0;
	align-items: stretch;
	justify-content: center;
	gap: var(--kern-metric-space-small);

	li {
		display: flex;
		align-items: center;

		&.dots {
			margin-top: -0.5rem;
		}
	}
}

.kern-btn {
	padding: 0;
	min-width: var(--kern-metric-dimension-large);
	min-height: calc(
		var(--kern-metric-dimension-large) + var(--kern-metric-dimension-2x-small)
	);
	height: 100%;

	&:has(.kern-sr-only) {
		width: var(--kern-metric-dimension-large);
	}

	.kern-label {
		font-size: var(--kern-typography-font-size-small-static);
		line-height: var(--kern-typography-line-height-medium-static);
	}

	&.active {
		background-color: var(--kern-color-action-default);
		pointer-events: none;

		.kern-label {
			color: var(--kern-color-action-on-default);
		}
	}
}
</style>
