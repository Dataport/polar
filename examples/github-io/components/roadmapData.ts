export interface RoadmapItem {
	body: string
	title: string
	accentIcon?: string
}

export type PhaseStatus = 'done' | 'progress' | 'planned'

export interface Phase {
	accentIcon: string
	items: RoadmapItem[]
	label: string
	milestoneIcon: string
	status: PhaseStatus
	sublabel: string
}

export const phases: Phase[] = [
	{
		status: 'done',
		label: 'Q4 · 2023',
		sublabel: 'Completed',
		accentIcon: 'check',
		milestoneIcon: 'check',
		items: [
			{
				title: 'Core Framework Release',
				body: 'Initial release with OpenLayers integration, plugin system, and i18n support.',
				accentIcon: 'orbit',
			},
			{
				title: 'Plugin Suite Expanded',
				body: 'Added address search, reverse geocoder, scale bar, fullscreen toggle, layer chooser, and toast notifications.',
				accentIcon: 'extension',
			},
		],
	},
	{
		status: 'done',
		label: 'Q1 · 2025',
		sublabel: 'Completed',
		accentIcon: 'check',
		milestoneIcon: 'check',
		items: [
			{
				title: 'More Geostuff',
				body: 'Extended GeoJSON handling, cluster visualisation, and improved WMS/WFS layer management.',
				accentIcon: 'map',
			},
			{
				title: 'New Plugin - Routing',
				body: 'Added routing plugin with support for multiple transport modes and customizable route styling.',
				accentIcon: 'alt-route',
			},
			{
				title: 'Added Monument Icon Package',
				body: 'Integrated the monument icon set, expanding the icon library for cultural heritage use cases.',
				accentIcon: 'museum',
			},
			{
				title: 'Fixed some bugs',
				body: 'Various stability improvements and regression fixes across the plugin ecosystem.',
				accentIcon: 'settings',
			},
		],
	},
	{
		status: 'progress',
		label: 'Q2 · 2025',
		sublabel: 'In Progress',
		accentIcon: 'location-on',
		milestoneIcon: '',
		items: [
			{
				title: 'KERN Design System Integration',
				body: 'Full migration of all UI components to @kern-ux/native, ensuring a consistent public-sector look and feel.',
				accentIcon: 'accessibility',
			},
			{
				title: 'Technical Migration towards Vue 3',
				body: 'Migration of core components and plugins to Vue 3, leveraging the latest features and improvements.',
				accentIcon: 'rocket-launch',
			},
			{
				title: 'Fixing more bugs',
				body: 'Further improvements across the core and plugin ecosystem.',
				accentIcon: 'settings',
			},
		],
	},
	{
		status: 'planned',
		label: 'Q1 · 2027',
		sublabel: 'Planned',
		accentIcon: 'palette',
		milestoneIcon: '',
		items: [
			{
				title: 'Enhanced UX & Theming',
				body: 'Dark mode support, theming API, and improved mobile interaction patterns.',
				accentIcon: 'palette',
			},
			{
				title: 'E2E Testing & CI/CD',
				body: 'Enhance end-to-end testing and continuous integration/continuous deployment pipelines.',
				accentIcon: 'build',
			},
		],
	},
	{
		status: 'planned',
		label: 'Q2 · 2027',
		sublabel: 'Planned',
		accentIcon: 'palette',
		milestoneIcon: '',
		items: [
			{
				title: 'Something Wonderful',
				body: 'Stay tuned — we have exciting things in the works for the next major release.',
				accentIcon: 'looks',
			},
		],
	},
]
