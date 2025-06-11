<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { type SuperForm } from 'sveltekit-superforms';

	type Props = HTMLFormAttributes & {
		children?: Snippet;
		frm: SuperForm<T>;
	};

	let { children, frm, ...rest }: Props = $props();

	const { enhance } = frm;
</script>

<form method="POST" use:enhance {...rest}>
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</form>
