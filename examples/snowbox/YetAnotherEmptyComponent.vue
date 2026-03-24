<template>
	<div style="background: #fff; z-index: 99999; pointer-events: all">
		Awesome
		<button @click="goHamburg()">Go to Hamburg</button>
	</div>
</template>

<script setup lang="ts">
// eslint-disable-next-line
// @ts-nocheck

const coreStore = document.getElementById('snowbox').store

function goHamburg() {
	coreStore.center = [561210, 5932600]
}
</script>
