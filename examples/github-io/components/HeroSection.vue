<template>
	<section>
		<h1>
			<span>The </span>
			<span class="lp-hero__title-highlight">configurable</span>
			<br />
			<span class="lp-hero__title-code">&lt;</span>
			<span>map element solution</span>
			<span class="lp-hero__title-code">/&gt;</span>
		</h1>
		<h2>
			<span>reusable plugins</span>
			<span class="lp-hero__subtitle-dot">&nbsp;&middot;&nbsp;</span>
			<span>extensible library</span>
			<span class="lp-hero__subtitle-dot">&nbsp;&middot;&nbsp;</span>
			<span>KERN Design</span>
		</h2>
		<div class="lp-hero__map">
			<HeroPolarMap />
		</div>
		<div class="lp-hero__ctas">
			<a
				href="https://polar.dataport.de/next/"
				target="_blank"
				rel="noopener"
				class="kern-btn kern-btn--primary"
			>
				<span
					class="kern-icon kern-icon-fill--ar-stickers"
					aria-hidden="true"
				/>
				<span class="kern-label">Try me out</span>
			</a>
			<a
				href="https://github.com/Dataport/polar"
				target="_blank"
				rel="noopener"
				class="kern-btn kern-btn--secondary"
			>
				<span class="kern-icon kern-icon--open-in-new" aria-hidden="true" />
				<span class="kern-label">Download</span>
			</a>
		</div>
	</section>
</template>

<script setup lang="ts">
import HeroPolarMap from './HeroPolarMap.vue'
</script>

<style scoped>
section {
	margin-bottom: 3.5rem;

	h1,
	h2 {
		color: var(--kern-color-layout-text-inverse);
		text-align: center;
		font-style: normal;
		letter-spacing: var(--kern-metric-space-none);

		span {
			text-shadow:
				0 52px 15px rgba(0, 0, 0, 0),
				0 33px 13px rgba(0, 0, 0, 0.02),
				0 19px 11px rgba(0, 0, 0, 0.08),
				0 8px 8px rgba(0, 0, 0, 0.13),
				0 2px 5px rgba(0, 0, 0, 0.15);
		}
	}

	h1 {
		font-size: 4rem;
		font-weight: var(--kern-typography-font-weight-medium);
		line-height: var(--kern-typography-line-height-2x-large-adaptive);
		margin-top: 0;
		margin-bottom: 1rem;

		.lp-hero__title-highlight {
			/* TODO: Add this as a variable */
			color: #47ffb0;
			font-family:
				Spartan, sans-serif; /* TODO: Is not the same as in the design */
			font-weight: var(--kern-typography-font-weight-regular);
		}

		.lp-hero__title-code {
			color: #47ffb0;
			text-align: center;
			font-family: 'Fira Code', sans-serif;
			font-weight: var(--kern-typography-font-weight-regular);
		}
	}

	h2 {
		font-size: 2rem;
		font-weight: var(--kern-typography-font-weight-semi-bold);
		line-height: var(--kern-typography-line-height-large-adaptive);

		.lp-hero__subtitle-dot {
			color: #3effab;
			/* Hacked */
			font-size: 1.75em;
			vertical-align: middle;
			line-height: 0;
		}
	}

	.lp-hero__map {
		max-width: 960px;
		margin: 0 auto 2.5rem;
	}

	.lp-hero__ctas {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;

		.kern-btn {
			width: 16rem;
		}
	}
}
</style>
