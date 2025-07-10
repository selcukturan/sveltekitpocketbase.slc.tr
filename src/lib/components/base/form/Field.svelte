<script lang="ts">
	import { type Snippet } from 'svelte';

	type Props = {
		input: Snippet<[string]>;
		field: string;
		required?: boolean;
	};

	let { input, field, required = false }: Props = $props();

	const inputClass: string =
		'focus:ring-primary-500 block w-full min-w-0 rounded-br-md rounded-bl-md border-none bg-transparent pt-0.5 pb-1.5 ring-0 outline-0 disabled:cursor-not-allowed disabled:opacity-5';
</script>

<div class="group bg-surface-200 focus-within:bg-surface-300 relative m-0.5 block w-full rounded-md">
	<label
		for={field}
		class="text-surface-500 group-focus-within:text-surface-950 flex w-full items-center gap-1 rounded-tl-md rounded-tr-md bg-transparent pt-2.5 pr-3 pb-0.5 pl-3 text-xs font-semibold select-none"
		class:required
	>
		{field}
	</label>
	{#if input}
		{@render input(inputClass)}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</div>

<style lang="postcss">
	.required::after {
		content: '*';
		color: var(--color-error-600);
		margin-top: -2px;
		margin-left: -2px;
	}
</style>
