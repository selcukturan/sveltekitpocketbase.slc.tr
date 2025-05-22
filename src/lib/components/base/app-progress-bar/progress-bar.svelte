<script lang="ts">
	import { navigating } from '$app/state';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';

	type NavigatingStoreType = typeof navigating;
	// Svelte 5 Runes
	let {
		navigate
	}: {
		navigate: NavigatingStoreType;
	} = $props();
</script>

{#if navigate.to}
	<div class="navigation-loader" in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}>navigating to {navigate.to.url.pathname}</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
	.navigation-loader {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		height: 4px;
		z-index: 50;
		background-color: var(--color-secondary-600);
	}
</style>
