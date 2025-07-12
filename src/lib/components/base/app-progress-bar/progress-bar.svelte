<script lang="ts">
	import { navigating } from '$app/state';
	import { expoOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	type NavigatingStoreType = typeof navigating;
	// Svelte 5 Runes
	let {
		navigate,
		children
	}: {
		navigate: NavigatingStoreType;
		children?: Snippet;
	} = $props();
</script>

{#if navigate.to}
	<div
		class="navigation-loader bg-secondary-600 fixed top-0 right-0 left-0 z-50 h-1"
		in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}
	></div>
{/if}

{#if children}
	{@render children?.()}
{/if}
