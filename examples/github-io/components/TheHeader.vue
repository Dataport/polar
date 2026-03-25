<template>
	<header class="lp-header" role="banner">
		<a href="#" class="lp-header__logo" aria-label="POLAR - Home">
			<img :src="polarLogoSvg" class="lp-header__icon" alt="POLAR" />
		</a>
		<nav class="lp-header__nav">
			<a href="#" class="lp-header__link" aria-current="page">
				<span class="kern-icon kern-icon--home" aria-hidden="true" />
				Home
			</a>
			<!--
						<a href="./docs/" class="lp-header__link">
							<span class="kern-icon kern-icon--school" aria-hidden="true" />
							Learn
						</a>
						-->
			<a href="./docs/" class="lp-header__link">
				<span class="kern-icon kern-icon--book-5" aria-hidden="true" />
				Docs
			</a>
		</nav>
		<a
			href="https://github.com/Dataport/polar"
			target="_blank"
			rel="noopener"
			class="lp-header__github"
		>
			<span class="kern-icon kern-icon--open-in-new" aria-hidden="true" />
			Find us on GitHub
			<svg
				viewBox="0 0 24 24"
				fill="currentColor"
				class="lp-header__github-icon"
				aria-hidden="true"
			>
				<path
					d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"
				/>
			</svg>
		</a>
	</header>
</template>

<script setup lang="ts">
import polarLogoSvg from './assets/polar-logo.svg'
</script>

<style scoped>
.lp-header {
	background: transparent;
	color: #fff;
	padding: 2.5rem 0 2.5rem;
	position: relative;
	z-index: 1;

	display: flex;
	justify-content: space-around;
	align-items: center;
	gap: 1.5rem;
}
.lp-header__logo {
	text-decoration: none;
	display: inline-flex;
	align-items: center;
}
.lp-header__icon {
	height: 4rem;
	min-width: 12rem;
	width: auto;
	flex-shrink: 0;
}
.lp-header__nav {
	display: flex;
	align-items: center;
	gap: 8px;
	border-radius: 9999px;
	padding: 10px;
	height: 4rem;
	background: linear-gradient(
		160deg,
		rgba(255, 255, 255, 0.18) 0%,
		rgba(255, 255, 255, 0.05) 60%,
		rgba(255, 255, 255, 0.1) 100%
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
	height: 100%;
	border-radius: 999px;
	transition:
		background 0.15s,
		color 0.15s;
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
	height: 4rem;
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
}
.lp-header__github .kern-icon {
	background-color: #004787;
	flex-shrink: 0;
}
.lp-header__github:hover .kern-icon {
	background-color: #003087;
}
.lp-header__github-icon {
	flex-shrink: 0;
	width: 2.0625rem;
	height: 2rem;
}
.lp-header__github:hover {
	background: rgba(255, 255, 255, 0.62);
}
@media (max-width: 768px) {
	.lp-header {
		padding: 0 1.5rem;
	}
	.lp-header {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		gap: 1rem;
	}
	.lp-header__nav {
		grid-column: 1 / -1;
		grid-row: 2;
		order: unset;
		justify-content: stretch;
		margin-bottom: 2rem;
	}
	.lp-header__nav {
		height: auto;
		padding: 8px;
		border-radius: 1rem;
		gap: 4px;
		width: 100%;
		justify-content: space-around;
	}
	/* GitHub button: compact icon-only pill */
	.lp-header__github {
		width: auto;
		height: auto;
		padding: 0.6rem 0.9rem;
		gap: 0;
		font-size: 0;
	}
	.lp-header__github .kern-icon {
		display: none;
	}
	.lp-header__link {
		width: 50%;
		justify-content: center;
	}
}
</style>
