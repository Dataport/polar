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
		label: 'Q4 · 2024',
		sublabel: 'Completed',
		accentIcon: 'check',
		milestoneIcon: 'check',
		items: [
			{
				title: 'Core Framework Release',
				body: 'Initial release with OpenLayers integration, plugin system, and i18n support.',
			},
			{
				title: 'Plugin Suite Expanded',
				body: 'Added address search, reverse geocoder, scale bar, fullscreen toggle, layer chooser, and toast notifications.',
			},
		],
	},
	{
		status: 'progress',
		label: 'Q1 · 2025',
		sublabel: 'In Progress',
		accentIcon: 'location-on',
		milestoneIcon: '',
		items: [
			{
				title: 'More Geostuff',
				body: 'Extended GeoJSON handling, cluster visualisation, and improved WMS/WFS layer management.',
			},
			{
				title: 'KERN Design System Integration',
				body: 'Full migration of all UI components to @kern-ux/native, ensuring a consistent public-sector look and feel.',
			},
			{
				title: 'Added Monument Icon Package',
				body: 'Integrated the monument icon set, expanding the icon library for cultural heritage use cases.',
			},
			{
				title: 'Fixed some bugs',
				body: 'Various stability improvements and regression fixes across the plugin ecosystem.',
				accentIcon: 'check',
			},
		],
	},
	{
		status: 'planned',
		label: 'Q4 · 2025',
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
				title: 'Something Wonderful',
				body: 'Stay tuned — we have exciting things in the works for the next major release.',
				accentIcon: 'rocket-launch',
			},
		],
	},
]
