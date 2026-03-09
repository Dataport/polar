<template>
	<section class="lp-section lp-dx-section" aria-labelledby="dx-heading">
		<div class="lp-container">
			<div class="lp-dx-grid">
				<!-- Left column: copy + checklist -->
				<div class="lp-dx-left">
					<div class="lp-section-header lp-section-header--left">
						<span class="lp-pill lp-pill--blue" role="note"
							>Developer Experience</span
						>
						<h2 id="dx-heading">Code so easy, your cat could do it!</h2>
						<p>
							Get started in minutes with POLAR's intuitive API. Our framework
							is designed to make complex mapping tasks simple while giving you
							full control when you need it.
						</p>
					</div>

					<ul class="lp-checklist" aria-label="Developer experience highlights">
						<li v-for="item in checklist" :key="item">
							<span class="lp-checklist__check" aria-hidden="true">✔</span>
							<span>{{ item }}</span>
						</li>
					</ul>
				</div>

				<!-- Right column: code block -->
				<div class="lp-dx-right">
					<div class="lp-code-wrap">
						<div class="lp-code-tabs" role="tablist" aria-label="Code examples">
							<button
								v-for="tab in tabs"
								:key="tab.id"
								type="button"
								:class="[
									'lp-code-tab',
									{ 'lp-code-tab--active': activeTab === tab.id },
								]"
								role="tab"
								:aria-selected="activeTab === tab.id"
								:aria-controls="`tab-panel-${tab.id}`"
								@click="activeTab = tab.id"
							>
								{{ tab.label }}
							</button>
						</div>
						<div class="lp-code-body">
							<!-- eslint-disable vue/no-v-html -- safe: HTML-escaped hardcoded strings with syntax-highlight spans -->
							<pre
								:id="`tab-panel-${activeTab}`"
								class="lp-code-pre"
								role="tabpanel"
								tabindex="-1"
								v-html="codeSnippets[activeTab]"
							/>
							<!-- eslint-enable vue/no-v-html -->
							<button
								class="lp-code-copy"
								:aria-label="copied ? 'Copied!' : 'Copy code'"
								@click="copyCode"
							>
								{{ copied ? '✓ Copied' : 'Copy' }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const tabs = [
	{ id: 'install', label: 'Install' },
	{ id: 'quickstart', label: 'Quickstart' },
	{ id: 'advanced', label: 'Advanced' },
]

const activeTab = ref('install')
const copied = ref(false)

const rawCode: Record<string, string> = {
	install: `# npm
npm install @polar/polar

# yarn
yarn add @polar/polar`,

	quickstart: `import { createMap } from '@polar/polar'

const map = await createMap(
  'map-container',   // id of the element to replace
  {
    startCenter: [553655, 6004479],
    layers: [
      { id: 'basemap', name: 'Basemap' },
    ],
  },
  'https://example.com/services.json' // or pass array directly
)`,

	advanced: `// Add plugins and subscribe to store changes
import { addPlugins, getStore, subscribe } from '@polar/polar'
import pluginIconMenu from '@polar/polar/plugins/iconMenu'
import pluginLayerChooser from '@polar/polar/plugins/layerChooser'
import pluginScale from '@polar/polar/plugins/scale'

const map = await createMap('map-container', {
  startCenter: [553655, 6004479],
  epsg: 'EPSG:25832',
  layout: 'nineRegions',
  layers: [{ id: 'basemap', name: 'Basemap' }],
}, serviceRegister)

addPlugins(map, [
  pluginIconMenu({ 
  	displayComponent: true, 
	layoutTag: 'TOP_RIGHT',
    menus: [[{ plugin: pluginLayerChooser({}) }]] 
	}),
  pluginScale({ 
  	displayComponent: true, 
	layoutTag: 'BOTTOM_RIGHT' }),
])

// React to store changes
const unsubscribe = subscribe(map, 'core', 'zoom', (zoom) => {
  console.log('zoom changed to', zoom)
})`,
}

const escapeHtml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const highlight = (code: string) =>
	escapeHtml(code)
		.replace(/('[^']*'|"[^"]*")/g, '<span class="lp-token-str">$1</span>')
		.replace(
			/(import|from|await|const|export|async|function)/g,
			'<span class="lp-token-kw">$1</span>'
		)
		.replace(/(\/\/.*)/g, '<span class="lp-token-cm">$1</span>')
		.replace(/(^#[^\n]*)/gm, '<span class="lp-token-cm">$1</span>')
		.replace(
			/(createMap|createApp|addPlugins?|register)\b/g,
			'<span class="lp-token-fn">$1</span>'
		)

const codeSnippets = computed(() =>
	Object.fromEntries(Object.entries(rawCode).map(([k, v]) => [k, highlight(v)]))
)

const copyCode = async () => {
	try {
		await navigator.clipboard.writeText(rawCode[activeTab.value])
		copied.value = true
		setTimeout(() => {
			copied.value = false
		}, 2000)
	} catch {
		/* clipboard not available */
	}
}

const checklist = [
	'Regular updates and improvements',
	'Configurable solutions',
	'Built upon Open Geospatial Consortium Guidelines',
	'Comprehensive documentation and examples',
	'Public Money, Public Code',
]
</script>

<style scoped>
/* ── Section theming ──────────────────────────────────────── */
.lp-dx-section {
	background: #f7f7f9;
	color: #171a2b;
}
.lp-dx-section h2 {
	color: #171a2b;
}
.lp-dx-section p {
	color: #4a5068;
}

/* ── Two-column grid ──────────────────────────────────────── */
.lp-dx-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 3rem;
	align-items: center;
}
.lp-dx-right {
	min-width: 0;
}
@media (max-width: 768px) {
	.lp-dx-grid {
		grid-template-columns: 1fr;
	}
}

/* ── Checklist base styles ────────────────────────────────── */
.lp-checklist {
	list-style: none;
	padding: 0;
	margin: 2rem 0 0;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.lp-checklist li {
	display: flex;
	align-items: flex-start;
	gap: 0.75rem;
	font-size: 1rem;
}
.lp-checklist__check {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.5rem;
	height: 1.5rem;
	min-width: 1.5rem;
	border-radius: 50%;
	background: #dcfce7;
	color: #15803d;
	font-size: 0.875rem;
	font-weight: 700;
}

/* ── Checklist badge: POLAR Blue 500 + white check ─────────── */
:deep(.lp-checklist__check),
.lp-checklist__check {
	background: var(--polar-blue-500) !important;
	color: #fff !important;
}

.lp-code-wrap {
	background: var(--polar-code-bg);
	border-radius: var(--polar-radius);
	overflow: hidden;
	width: 100%;
	max-width: 688px;
	height: 440px;
	display: flex;
	flex-direction: column;
}
.lp-code-tabs {
	display: flex;
	flex-shrink: 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.lp-code-tab {
	padding: 0.6rem 1.25rem;
	font-size: 0.875rem;
	cursor: pointer;
	border: none;
	background: transparent;
	color: #92abdf;
	font-family: inherit;
	transition:
		color 0.15s,
		background 0.15s;
	border-bottom: 2px solid transparent;
}
.lp-code-tab:hover {
	color: #fff;
}
.lp-code-tab--active {
	color: #000;
	background: #92abdf;
	border-bottom-color: transparent;
}
.lp-code-body {
	position: relative;
	flex: 1;
	overflow: hidden;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
}
.lp-code-pre {
	margin: 0;
	font-family: 'Fira Code', monospace;
	font-weight: 600;
	font-size: 0.85rem;
	line-height: 1.7;
	overflow: auto;
	color: #e2e8f0;
	white-space: pre;
	flex: 1;
}
.lp-code-copy {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: rgba(255, 255, 255, 0.1);
	border: none;
	border-radius: 4px;
	color: rgba(255, 255, 255, 0.65);
	font-size: 0.75rem;
	padding: 0.3rem 0.7rem;
	cursor: pointer;
	font-family: inherit;
}
.lp-code-copy:hover {
	background: rgba(255, 255, 255, 0.2);
	color: #fff;
}

:global(.lp-token-kw) {
	color: #fc0c91;
}
:global(.lp-token-fn) {
	color: #7dd3fc;
}
:global(.lp-token-str) {
	color: #00d388;
}
:global(.lp-token-cm) {
	color: #6b7280;
}
</style>
