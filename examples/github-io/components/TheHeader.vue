<template>
	<header class="lp-header" role="banner">
		<div class="lp-container">
			<div class="lp-header__inner">
				<div class="lp-header__logos" aria-label="Used by">
					<img
						class="lp-header__logo"
						:src="hamburgLogo"
						alt="Hamburg"
					/>
					<img
						class="lp-header__logo"
						:src="shLogo"
						alt="Schleswig-Holstein"
					/>
					<img
						class="lp-header__logo"
						:src="bremenLogo"
						alt="Bremen"
					/>
					<img
						class="lp-header__logo"
						:src="sachsenAnhaltLogo"
						alt="Sachsen-Anhalt"
					/>
					<div class="lp-header__used-by" aria-hidden="true">
						<span
							class="kern-icon kern-icon--open-in-new"
							style="background-color: #fff; opacity: 0.7"
						></span>
						<span>used by</span>
					</div>
				</div>
				<div class="lp-header__right">
					<img
						class="lp-header__logo"
						:src="shProductiveLogo"
						alt="Schleswig-Holstein"
					/>
					<img
						class="lp-header__logo"
						style="height: 32px"
						:src="dataportLogo"
						alt="Dataport"
					/>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import dataportLogo from '../../../docs/assets/productive-users/dataport-logo.svg'
import shProductiveLogo from '../../../docs/assets/productive-users/schleswig-holstein-logo.svg'
import bremenLogo from '../../../docs/assets/landessymbole/bremen.svg'
import hamburgLogo from '../../../docs/assets/landessymbole/hamburg.svg'
import sachsenAnhaltLogo from '../../../docs/assets/landessymbole/sachsen-anhalt.svg'
import shLogo from '../../../docs/assets/landessymbole/schleswig-holstein.svg'
</script>

<style scoped>
.lp-header {
	background: var(--polar-navy);
	color: #fff;
	padding: 0.75rem 0;
}
.lp-header__inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1rem;
}
.lp-header__logos {
	display: flex;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}
.lp-header__logo {
	height: 40px;
	width: auto;
}
.lp-header__used-by {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 0.8rem;
	opacity: 0.75;
	white-space: nowrap;
}
.lp-header__right {
	display: flex;
	align-items: center;
	gap: 1.5rem;
}
</style>
