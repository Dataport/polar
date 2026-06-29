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
			<KernButton
				class="kern-btn--tertiary"
				icon="kern-icon--close"
				:label-sr-only="true"
				@click="store.removeToast(toast.originalToast)"
			>
				{{ $t(($) => $.dismissButton.label, { ns: PluginId }) }}
			</KernButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { ToastSeverity } from '../types'

import { computed } from 'vue'

import KernButton from '@/components/kern/KernButton.ce.vue'
import { getCssColor } from '@/lib/getCssColor'

import { useToastStore } from '../store'
import { PluginId } from '../types'

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
	margin-left: var(--kern-metric-space-none);
	margin-right: var(--kern-metric-space-none);
	z-index: 2;

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
</style>
