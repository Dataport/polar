<template>
	<section class="lp-section">
		<div>
			<SectionHeader
				badge="Developer Experience"
				badge-color="blue"
				align="left"
				title="Code so easy, your cat could do it!"
				description="Get started in minutes with POLAR's intuitive API. Our framework is designed to make complex mapping tasks simple while giving you full control when you need it."
			/>
			<ul class="kern-list" aria-label="Developer experience highlights">
				<li>
					<span
						class="kern-icon kern-icon-fill--check-circle"
						aria-hidden="true"
					/>
					Regular updates and improvements
				</li>
				<li>
					<span
						class="kern-icon kern-icon-fill--check-circle"
						aria-hidden="true"
					/>
					Configurable solutions
				</li>
				<li>
					<span
						class="kern-icon kern-icon-fill--check-circle"
						aria-hidden="true"
					/>
					Built upon
					<a class="kern-link" href="https://www.ogc.org/" target="_blank">
						Open Geospatial Consortium Guidelines
					</a>
				</li>
				<li>
					<span
						class="kern-icon kern-icon-fill--check-circle"
						aria-hidden="true"
					/>
					Official
					<a
						class="kern-link"
						href="https://www.osgeo.org/projects/polar/"
						target="_blank"
					>
						OSGeo community project
					</a>
				</li>
				<li>
					<span
						class="kern-icon kern-icon-fill--check-circle"
						aria-hidden="true"
					/>
					Comprehensive documentation and examples
				</li>
				<li>
					<span
						class="kern-icon kern-icon-fill--check-circle"
						aria-hidden="true"
					/>
					Tried & Tested with 70+ productive uses
				</li>
			</ul>
		</div>
		<div class="lp-code-wrap">
			<div class="code-tablist-wrapper">
				<div role="tablist">
					<button
						v-for="tab in tabs"
						:id="`tab-${tab.id}`"
						:key="tab.id"
						:class="[
							'kern-btn',
							{ 'kern-btn--primary': activeTab === tab.id },
							{ 'kern-btn--tertiary': activeTab !== tab.id },
						]"
						role="tab"
						:aria-selected="activeTab === tab.id"
						:aria-controls="`tab-panel-${tab.id}`"
						:tabindex="activeTab === tab.id ? 0 : -1"
						@click="activeTab = tab.id"
						@keydown="handleTabKeydown($event, tab.id)"
					>
						<span class="kern-label">{{ tab.label }}</span>
					</button>
				</div>
				<button
					class="kern-btn kern-btn--tertiary copy-btn"
					:aria-label="copied ? 'Copied!' : 'Copy code'"
					@click="copyCode"
				>
					<span
						class="kern-icon"
						:class="
							copied ? 'kern-icon--check' : 'kern-icon-fill--content-copy'
						"
					/>
					<span class="kern-label">{{ copied ? 'Copied' : 'Copy' }}</span>
				</button>
			</div>
			<!-- eslint-disable vue/no-v-html -- safe: HTML-escaped hardcoded strings with syntax-highlight spans -->
			<pre
				:id="`tab-panel-${activeTab}`"
				class="lp-code-pre"
				role="tabpanel"
				:aria-labelledby="`tab-${activeTab}`"
				tabindex="-1"
				v-html="codeSnippets[activeTab]"
			/>
			<!-- eslint-enable vue/no-v-html -->
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

import { highlightCode, nextTabId } from './devexBehavior'
import { rawCode, tabs } from './devexContent'
import SectionHeader from './SectionHeader.vue'

const activeTab = ref<(typeof tabs)[number]['id']>('install')
const copied = ref(false)
let copiedTimeout: ReturnType<typeof setTimeout> | undefined

const codeSnippets = computed(() =>
	Object.fromEntries(
		Object.entries(rawCode).map(([key, code]) => [key, highlightCode(code)])
	)
)

const handleTabKeydown = (
	event: KeyboardEvent,
	tabId: (typeof tabs)[number]['id']
) => {
	if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
		return
	}

	event.preventDefault()
	const direction = event.key === 'ArrowRight' ? 1 : -1
	activeTab.value = nextTabId(tabs, tabId, direction)
	document.getElementById(`tab-${activeTab.value}`)?.focus()
}

const copyCode = async () => {
	try {
		await navigator.clipboard.writeText(rawCode[activeTab.value])
		copied.value = true
		if (copiedTimeout) {
			clearTimeout(copiedTimeout)
		}
		copiedTimeout = setTimeout(() => {
			copied.value = false
		}, 2000)
	} catch {
		/* clipboard not available */
	}
}

onUnmounted(() => {
	if (copiedTimeout) {
		clearTimeout(copiedTimeout)
	}
})
</script>

<style scoped>
@media (max-width: 1275px) {
	section {
		flex-direction: column;
		align-items: center;
		padding: 2rem 2rem;
		gap: var(--kern-metric-space-x-large);

		.lp-section-header p {
			width: 100%;
		}

		.lp-code-wrap {
			width: 100%;
		}
	}
}

section {
	display: flex;
	justify-content: center;
	gap: 2rem;
	padding: 2rem clamp(2rem, 5vw, 10rem);
	background: var(--kern-color-layout-background-hued);

	.lp-section-header {
		margin-bottom: var(--kern-metric-space-x-large);

		p {
			max-width: 34rem;
			color: var(--kern-color-layout-text-muted);
		}

		h3 {
			margin: var(--kern-metric-space-default) 0;
		}
	}

	.kern-list {
		padding: 0;

		li {
			display: flex;
			gap: var(--kern-metric-space-small);
			color: var(--kern-color-layout-text-muted);

			.kern-icon-fill--check-circle {
				background: var(--polar-blue-500);
			}

			.kern-link {
				padding: 0;
			}
		}

		li:not(:last-child) {
			margin-bottom: var(--kern-metric-space-small);
		}
	}

	.lp-code-wrap {
		display: flex;
		flex-direction: column;
		width: min(43rem, 100%);
		max-width: 43rem;
		min-width: 0;
		height: 27.5rem;
		padding: var(--kern-metric-space-default);
		overflow: hidden;
		background: #000;
		border-radius: var(--kern-metric-border-radius-large);
		box-shadow:
			0 112px 31px 0 rgba(0, 0, 0, 0),
			0 72px 29px 0 rgba(0, 0, 0, 0.01),
			0 40px 24px 0 rgba(0, 0, 0, 0.03),
			0 18px 18px 0 rgba(0, 0, 0, 0.06),
			0 4px 10px 0 rgba(0, 0, 0, 0.07);

		.code-tablist-wrapper {
			display: flex;
			align-items: flex-start;
			gap: var(--kern-metric-space-small);
			flex-wrap: wrap;
			margin-bottom: var(--kern-metric-space-x-large);

			> [role='tablist'] {
				display: flex;
				flex: 1 1 0;
				flex-wrap: wrap;
				gap: var(--kern-metric-space-2x-small);
				min-width: 0;
			}

			.kern-btn {
				font-size: var(--kern-typography-font-size-medium-static);
				font-weight: var(--kern-typography-font-weight-medium);

				&:focus {
					box-shadow: none;
				}
			}

			.kern-btn--primary {
				.kern-label {
					color: #000;
				}
				background: var(--kern-color-darkblue-300);
			}

			.kern-btn--tertiary {
				.kern-label {
					text-decoration: none;
					color: var(--kern-color-darkblue-300);
				}
			}

			.copy-btn {
				/* Stops the jiggle */
				width: 8rem;
				flex: 0 0 8rem;

				.kern-icon {
					background: var(--kern-color-darkblue-300);
				}
				.kern-label {
					color: var(--kern-color-darkblue-300);
				}
			}
		}

		@media (max-width: 30rem) {
			.code-tablist-wrapper {
				.copy-btn {
					margin-left: auto;
				}
			}
		}

		.lp-code-pre {
			flex: 1;
			min-width: 0;
			margin: 0;
			font-family: 'Fira Code', monospace;
			font-size: var(--kern-typography-font-size-medium-static);
			font-style: normal;
			font-weight: var(--kern-typography-font-weight-semi-bold);
			line-height: var(--kern-typography-line-height-large-static);
			letter-spacing: 0;
			overflow-x: hidden;
			overflow-y: auto;
			color: var(--polar-grey-300);
			white-space: pre-wrap;
		}
	}
}

:global(.lp-token-kw) {
	color: var(--polar-pink-450);
}
:global(.lp-token-fn) {
	color: var(--polar-blue-250);
}
:global(.lp-token-str) {
	color: var(--polar-green-250);
}
:global(.lp-token-cm) {
	color: var(--polar-grey-500);
}
</style>
