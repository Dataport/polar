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

const SCRIPT_CLOSE = '</' + 'script>'

const tabs = [
	{ id: 'install', label: 'Install' },
	{ id: 'quickstart', label: 'Quickstart' },
	{ id: 'advanced', label: 'Advanced' },
]

const activeTab = ref('install')
const copied = ref(false)

const rawCode: Record<string, string> = {
	install: `# npm
npm install @polar/core @polar/plugin-layer-chooser

# …or just use it as a Web Component (no build step needed)
<script src="https://cdn.jsdelivr.net/npm/@polar/core/dist/polar.js">${SCRIPT_CLOSE}`,

	quickstart: `<polar-map
  id="myMap"
  options='{
    "epsg": "EPSG:25832",
    "startCenter": [565765, 5933920],
    "startResolution": 10,
    "layers": [
      {
        "id": "basemap",
        "visibility": true,
        "type": "background",
        "url": "https://sgx.geodatenzentrum.de/wmts_basemapde",
        "layers": "de_basemapde_web_raster_farbe"
      }
    ]
  }'
></polar-map>`,

	advanced: `import { createMap } from '@polar/core'
import layerChooser from '@polar/plugin-layer-chooser'
import addressSearch from '@polar/plugin-address-search'

const map = await createMap({
  containerId: 'polar-root',
  plugins: [layerChooser(), addressSearch()],
  services: servicesSummary,
  mapConfiguration: {
    epsg: 'EPSG:25832',
    startCenter: [565765, 5933920],
    startResolution: 10,
    layers: [ /* … */ ]
  }
})`,
}

const escapeHtml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const highlight = (code: string) =>
	escapeHtml(code)
		.replace(
			/(import|from|await|const|export|async|function)/g,
			'<span class="lp-token-kw">$1</span>'
		)
		.replace(/('[^']*'|"[^"]*")/g, '<span class="lp-token-str">$1</span>')
		.replace(/(\/\/.*)/g, '<span class="lp-token-cm">$1</span>')
		.replace(/(#.*)/g, '<span class="lp-token-cm">$1</span>')
		.replace(
			/(createMap|createApp|addPlugin)\b/g,
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
@media (max-width: 768px) {
	.lp-dx-grid {
		grid-template-columns: 1fr;
	}
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
}
.lp-code-tabs {
	display: flex;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.lp-code-tab {
	padding: 0.6rem 1.25rem;
	font-size: 0.875rem;
	cursor: pointer;
	border: none;
	background: transparent;
	color: rgba(255, 255, 255, 0.55);
	font-family: inherit;
	transition:
		color 0.15s,
		border-color 0.15s;
	border-bottom: 2px solid transparent;
}
.lp-code-tab:hover {
	color: rgba(255, 255, 255, 0.85);
}
.lp-code-tab--active {
	color: #7dd3fc;
	border-bottom-color: #7dd3fc;
}
.lp-code-body {
	position: relative;
	padding: 1.5rem;
}
.lp-code-pre {
	margin: 0;
	font-family: 'Fira Mono', 'Fira Code', monospace;
	font-size: 0.85rem;
	line-height: 1.7;
	overflow-x: auto;
	color: #e2e8f0;
	white-space: pre;
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
	color: #c084fc;
}
:global(.lp-token-fn) {
	color: #7dd3fc;
}
:global(.lp-token-str) {
	color: #86efac;
}
:global(.lp-token-cm) {
	color: #6b7280;
}
</style>
