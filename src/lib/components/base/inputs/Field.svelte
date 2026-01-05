<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import Popup from './Popup.svelte';

	type Props = {
		input: Snippet<[string]>;
		label?: string;
		id?: string;
		required?: boolean;
		issues?: RemoteFormIssue[];
	};

	let { input, label, id = 'noname', required = false, issues }: Props = $props();

	const componentId = $props.id();

	const inputClass: string =
		'focus:ring-primary-500 m-0 block h-8 min-h-8 w-full min-w-0 rounded-br-md rounded-bl-md border-none bg-transparent pt-0.5 pr-3.5 pb-2 pl-3.5 text-base font-normal ring-0 outline-0 disabled:cursor-not-allowed disabled:opacity-5';
</script>

<div class="group bg-surface-200 focus-within:bg-surface-300 relative mt-6 block w-full rounded-md">
	<Popup {issues} />
	<label
		for={id || componentId}
		class="text-surface-500 group-focus-within:text-surface-950 flex w-full items-center gap-1 rounded-tl-md rounded-tr-md bg-transparent pt-2.5 pr-3.5 pb-0.5 pl-3.5 text-xs font-semibold select-none"
		class:required
	>
		{label || id || componentId}
	</label>
	{#if input}
		{@render input(inputClass)}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</div>

<style>
	.required::after {
		content: '*';
		color: var(--color-error-600);
		margin-top: -2px;
		margin-left: -2px;
	}
</style>
