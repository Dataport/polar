<template>
	<span :class="`kern-badge kern-badge--${$props.color}`">
		<span :class="`kern-label kern-label--small kern-label--${$props.color}`">
			<slot />
		</span>
	</span>
</template>

<script setup lang="ts">
defineProps<{
	color: 'blue' | 'dark-blue' | 'green' | 'pink'
}>()
</script>

<style scoped>
.kern-badge {
	border-radius: 624.9375rem;

	.kern-label--blue {
		color: var(--polar-blue-600);
	}

	.kern-label--dark-blue {
		color: var(--polar-blue-400);
	}

	.kern-label--green {
		color: var(--polar-green-600);
	}

	.kern-label--pink {
		color: var(--polar-pink-600);
	}
}

.kern-badge--blue {
	background: var(--polar-blue-100);
}
.kern-badge--dark-blue {
	background: var(--polar-blue-850);
}
.kern-badge--green {
	background: var(--polar-green-100);
}
.kern-badge--pink {
	background: var(--polar-pink-100);
}
</style>
