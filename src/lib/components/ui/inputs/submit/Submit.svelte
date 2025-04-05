<script lang="ts">
	/* import { Icon } from '@/components/icons'; */
	import type { Props } from './types';

	let {
		label = 'Gönder',
		submitting = false,
		delayed = false,
		timeout = false,
		class: classes,
		variant = undefined,
		size = undefined,
		...attributes
	}: Props = $props();
</script>

<button type="submit" disabled={delayed} class={classes} {...attributes}>
	{#if submitting && !delayed}
		<!-- <Icon name={`rotate-cw`} size={`18px`} class="animate-spin" /> -->
		<span class="animate-spin">♠</span>
		<div>Gönderiliyor...</div>
	{:else if delayed && !timeout}
		<!-- <Icon name={`loader`} size={`18px`} class="animate-spin" /> -->
		<span class="animate-spin">♥</span>
		<div>Lütfen bekleyin...</div>
	{:else if timeout}
		<!-- <Icon name={`compass`} size={`18px`} class="animate-spin" /> -->
		<span class="animate-spin">♣</span>
		<div>Lütfen bekleyin... Az kaldı.</div>
	{:else}
		{label}
	{/if}
</button>
