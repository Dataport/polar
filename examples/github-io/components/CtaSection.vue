<template>
	<section class="lp-section lp-section--brand" aria-labelledby="cta-heading">
		<div class="lp-container">
			<span class="lp-pill lp-pill--green" role="note">Get started today</span>
			<h2 id="cta-heading" style="margin-top: 0.75rem">
				Ready to Build Amazing Map Applications?
			</h2>
			<p
				style="
					max-width: 680px;
					margin: 0.5rem auto 2.5rem;
					font-size: 1.1rem;
					opacity: 0.85;
				"
			>
				Join the growing community of developers and public administrations
				using POLAR to deliver modern, accessible map experiences.
			</p>
			<div
				style="
					display: flex;
					justify-content: center;
					gap: 1rem;
					flex-wrap: wrap;
				"
			>
				<a
					href="https://polar.dataport.de/next/"
					target="_blank"
					rel="noopener"
					class="kern-btn kern-btn--primary"
					style="background: #fff"
				>
					<span
						class="kern-icon kern-icon--arrow-forward"
						style="background-color: var(--polar-blue)"
					/>
					<span class="kern-label" style="color: var(--polar-blue)">
						Try me out
					</span>
				</a>
				<a
					href="https://github.com/Dataport/polar"
					target="_blank"
					rel="noopener"
					class="kern-btn kern-btn--secondary"
					style="border-color: rgba(255, 255, 255, 0.7)"
				>
					<span
						class="kern-icon kern-icon--download"
						style="background-color: #fff"
					/>
					<span class="kern-label" style="color: #fff">Download</span>
				</a>
			</div>
			<div class="lp-cta-pills" aria-label="Key properties">
				<span class="lp-cta-pill">EUPL license</span>
				<span class="lp-cta-pill">Active Development</span>
				<span class="lp-cta-pill">Community Support</span>
				<span class="lp-cta-pill">KERN Compliant</span>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
// Static template component — no reactive state
</script>
