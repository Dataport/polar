import component from './components/PluginUI.vue'
import type { PluginContainer } from '@/core'

export default function pluginFullscreen(): PluginContainer {
	return {
		id: '@polar/polar/plugins/fullscreen',
		component,
		options: { displayComponent: true, layoutTag: 'MIDDLE_MIDDLE' },
	}
}
