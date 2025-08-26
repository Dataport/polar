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
			<span
				class="kern-icon"
				:class="toast.iconClass"
				aria-hidden="true"
			></span>
			<span class="kern-title">{{ toast.text }}</span>
			<span style="flex: 1" aria-hidden="true"></span>
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
import { useToastStore } from '../store'
import { PluginId, type ToastSeverity } from '../types'
import { getCssColor } from '@/lib/getCssColor'
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
			iconClass: toast.theme?.icon || `kern-icon--${kernSeverity}`,
			text: toast.text,
			originalToast: toast,
		}
	})
)
</script>

<style scoped>
.kern-alert {
	margin: 0.5em 0;
}

.kern-btn {
	margin-left: 0.3em;
	background-color: transparent;
}
</style>
