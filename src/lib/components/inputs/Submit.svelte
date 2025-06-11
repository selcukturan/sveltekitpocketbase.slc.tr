<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { type SuperForm } from 'sveltekit-superforms';

	type Props = HTMLButtonAttributes & {
		label?: string;
		frm: SuperForm<T>;
	};

	let { label = 'Gönder', frm, ...rest }: Props = $props();

	const { submitting, delayed, timeout } = frm;
</script>

<button type="submit" disabled={$delayed} {...rest}>
	{#if $submitting && !$delayed}
		<!-- <Icon name={`rotate-cw`} size={`18px`} class="animate-spin" /> -->
		<span class="animate-spin">♠</span>
		<div>Gönderiliyor...</div>
	{:else if $delayed && !$timeout}
		<!-- <Icon name={`loader`} size={`18px`} class="animate-spin" /> -->
		<span class="animate-spin">♥</span>
		<div>Lütfen bekleyin...</div>
	{:else if $timeout}
		<!-- <Icon name={`compass`} size={`18px`} class="animate-spin" /> -->
		<span class="animate-spin">♣</span>
		<div>Lütfen bekleyin... Az kaldı.</div>
	{:else}
		{label}
	{/if}
</button>
