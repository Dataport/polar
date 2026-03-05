<template>
	<header class="lp-header" role="banner">
		<div class="lp-container">
			<div class="lp-header__bar">
				<!-- Logo -->
				<a href="#" class="lp-header__logo" aria-label="POLAR – Home" v-html="polarLogoSvg"></a>

				<!-- Centered pill nav -->
				<nav class="lp-header__nav" aria-label="Main navigation">
					<div class="lp-header__pill">
						<a href="#" class="lp-header__link" aria-current="page">
							<span
								class="kern-icon kern-icon--home"
								aria-hidden="true"
							></span>
							Home
						</a>
						<a href="./docs/" class="lp-header__link">
							<span
								class="kern-icon kern-icon--school"
								aria-hidden="true"
							></span>
							Learn
						</a>
						<a
							href="https://polar.dataport.de/next/"
							target="_blank"
							rel="noopener"
							class="lp-header__link"
						>
							<span
								class="kern-icon kern-icon--ar-stickers"
								aria-hidden="true"
							></span>
							Playground
						</a>
						<a href="./docs/" class="lp-header__link">
							<span
								class="kern-icon kern-icon--book-5"
								aria-hidden="true"
							></span>
							Docs
						</a>
					</div>
				</nav>

				<!-- GitHub CTA -->
				<a
					href="https://github.com/Dataport/polar"
					target="_blank"
					rel="noopener"
					class="lp-header__github"
				>
					<span
						class="kern-icon kern-icon--open-in-new"
						aria-hidden="true"
					></span>
					Find us on GitHub
					<span v-html="githubIconSvg"></span>
				</a>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import polarLogoSvg from './assets/polar-logo.svg?raw'
import githubIconSvg from './assets/github-icon.svg?raw'
</script>

<style scoped>
.lp-header {
	background: transparent;
	color: #fff;
	padding: 2.5rem 0 2.5rem;
	position: relative;
	z-index: 1;
}
.lp-header .lp-container {
	max-width: none;
	padding: 0 4rem;
}
.lp-header__bar {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	align-items: center;
	gap: 2rem;
}
.lp-header__logo {
	text-decoration: none;
	display: inline-flex;
	align-items: center;
}
:deep(.lp-header__icon) {
	height: 68px;
	width: auto;
	flex-shrink: 0;
}
/* Centered pill */
.lp-header__nav {
	display: flex;
	justify-content: center;
}
.lp-header__pill {
	display: flex;
	align-items: center;
	gap: 8px;
	border-radius: 9999px;
	padding: 10px;
	height: 88px;
	background: linear-gradient(
		160deg,
		rgba(255, 255, 255, 0.18) 0%,
		rgba(255, 255, 255, 0.05) 60%,
		rgba(255, 255, 255, 0.10) 100%
	);
	border: 1px solid rgba(255, 255, 255, 0.22);
	box-shadow:
		0 1px 0 rgba(255, 255, 255, 0.28),
		inset 0 2px 6px rgba(0, 0, 0, 0.22);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
}
.lp-header__link {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: rgba(255, 255, 255, 0.9);
	text-decoration: none;
	font-size: 1.2rem;
	font-weight: 500;
	padding: 0.6rem 1.4rem;
	border-radius: 999px;
	transition: background 0.15s, color 0.15s;
	white-space: nowrap;
}
.lp-header__link:hover,
.lp-header__link[aria-current='page'] {
	background: rgba(255, 255, 255, 0.15);
	color: #fff;
}
.lp-header__link .kern-icon {
	background-color: rgba(255, 255, 255, 0.8);
}
.lp-header__link:hover .kern-icon,
.lp-header__link[aria-current='page'] .kern-icon {
	background-color: #fff;
}
/* GitHub button – right side */
.lp-header__github {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;
	color: #004787;
	text-decoration: none;
	font-size: 1.15rem;
	font-weight: 600;
	border-radius: 9999px;
	padding: 16px 20px 16px 28px;
	height: 88px;
	width: 300px;
	background: linear-gradient(
		160deg,
		rgba(255, 255, 255, 0.72) 0%,
		rgba(255, 255, 255, 0.42) 60%,
		rgba(255, 255, 255, 0.56) 100%
	);
	border: 1px solid rgba(255, 255, 255, 0.72);
	box-shadow:
		0 1px 0 rgba(255, 255, 255, 0.6),
		inset 0 2px 6px rgba(0, 48, 135, 0.12);
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
	box-sizing: border-box;
	transition: background 0.15s;
	white-space: nowrap;
	margin-left: auto;
}
.lp-header__github .kern-icon {
	background-color: #004787;
	flex-shrink: 0;
}
.lp-header__github:hover .kern-icon {
	background-color: #003087;
}
.lp-header__github svg {
	flex-shrink: 0;
	fill: #004787;
}
.lp-header__github:hover {
	background: rgba(255, 255, 255, 0.62);
}
@media (max-width: 768px) {
	.lp-header__bar {
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
	}
	.lp-header__nav {
		grid-column: 1 / -1;
		order: 3;
	}
	.lp-header__pill {
		flex-wrap: wrap;
		border-radius: 1rem;
	}
}
</style>
