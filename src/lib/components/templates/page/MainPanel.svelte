<script lang="ts">
	import { type Snippet } from 'svelte';
	/* import { getContext } from './context'; */

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();

	// Get Context
	/* const ctx = getContext(); */
</script>

<div class="{classes} {`wrapper relative mx-auto w-4xl max-w-full p-6`}">
	<div class="panel bg-surface-200 shadow-surface-400 rounded-xl p-6 shadow-md/30">
		{#if children}
			{@render children()}
		{:else}
			<span>İçerik yok.</span>
		{/if}
	</div>
</div>
