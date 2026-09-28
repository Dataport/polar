<template>
	<div :class="['lp-section-header', `lp-section-header--${align}`]">
		<Badge :color="badgeColor">{{ badge }}</Badge>
		<h3>{{ title }}</h3>
		<p>{{ description }}</p>
	</div>
</template>

<script setup lang="ts">
import Badge from './Badge.vue'

withDefaults(
	defineProps<{
		badge: string
		badgeColor: 'blue' | 'dark-blue' | 'green' | 'pink'
		title: string
		description: string
		align?: 'left' | 'center'
	}>(),
	{
		align: 'center',
	}
)
</script>
