<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string; // sayfa adı; sonuna ' - SLC Web Applications' eklenir
		description?: string;
		children?: Snippet; // özel head içeriği (title/description yerine)
	};

	let { title = 'Page', description = 'SLC Web Applications', children }: Props = $props();
</script>

<svelte:head>
	{#if children}
		{@render children()}
	{:else}
		<title>{title} - SLC Web Applications</title>
		<meta name="description" content={description} />
	{/if}
</svelte:head>
