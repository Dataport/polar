<template>
	<v-tooltip left :disabled="hasSmallDisplay">
		<template #activator="{ on, attrs }">
			<v-btn
				:color="open === index ? 'primaryContrast' : 'primary'"
				fab
				small
				:aria-label="$t(hint ? hint : `plugins.iconMenu.hints.${id}`)"
				v-bind="attrs"
				@click="toggle(index)"
				v-on="on"
			>
				<v-icon :color="open === index ? 'primary' : 'primaryContrast'">
					{{ icon }}
				</v-icon>
			</v-btn>
		</template>
		<span>{{ $t(hint ? hint : `plugins.iconMenu.hints.${id}`) }}</span>
	</v-tooltip>
</template>
