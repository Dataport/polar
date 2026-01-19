<template>
	<div
		v-for="(toast, idx) of toasts"
		:key="idx"
		class="kern-alert"
		:class="toast.alertClass"
		:style="toast.alertStyle"
		role="alert"
	>
		<div class="kern-alert__header">
			<span class="kern-icon" :class="toast.iconClass" aria-hidden="true" />
			<span class="kern-title">{{ toast.text }}</span>
			<button class="kern-btn" @click="store.removeToast(toast.originalToast)">
				<span class="kern-icon kern-icon--close" aria-hidden="true" />
				<span class="kern-label kern-sr-only">{{
					$t(($) => $.dismissButton.label, { ns: PluginId })
				}}</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { getCssColor } from '@/lib/getCssColor'

import { useToastStore } from '../store'
import { PluginId, type ToastSeverity } from '../types'
const store = useToastStore()

function getKernSeverity(severity: ToastSeverity) {
	return {
		error: 'danger',
		info: 'info',
		warning: 'warning',
		success: 'success',
	}[severity]
}

const toasts = computed(() =>
	store.toasts.map((toast) => {
		const kernSeverity = getKernSeverity(toast.severity)
		return {
			alertClass: `kern-alert--${kernSeverity}`,
			alertStyle: toast.theme?.color
				? {
						'background-color': getCssColor(toast.theme.color),
					}
				: {},
			// NOTE: The default icons are directly incorporated in KERN.
			iconClass: toast.theme?.icon || `kern-icon--${kernSeverity}`,
			text: toast.text,
			originalToast: toast,
		}
	})
)
</script>

<style scoped>
.kern-alert {
	margin: var(--kern-metric-space-small) var(--kern-metric-space-none);

	& > .kern-alert__header {
		padding: var(--kern-metric-space-x-small) var(--kern-metric-space-default);

		& > .kern-icon {
			display: none;

			@media (min-width: 30em) {
				display: initial;
			}
		}

		& > .kern-title {
			flex: 1;
			max-width: calc(100% - 2.5em);
			overflow-wrap: break-word;
		}
	}
}

.kern-btn {
	margin-left: var(--kern-metric-space-x-small);
	background-color: transparent;
}
</style>
