<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormIssue } from '$app/server';
	import type { Snippet } from 'svelte';

	type Props = Omit<SvelteHTMLElements['label'], 'id'> & {
		children: Snippet;
		addon?: Snippet;
		id: string;
		label: string;
		required?: boolean;
		fieldClasses?: string;
		issues?: RemoteFormIssue[];
	};

	let { children, addon, id, label, required = false, fieldClasses, issues, ...rest }: Props = $props();

	const fieldInputClasses = 'py-2';
	const fieldsClasses = 'group flex w-full items-stretch';

	const fieldInternalClasses = 'w-full min-w-0 relative block bg-surface-200 group-focus-within:bg-surface-300 outline-0';
	const fieldClassesRounded = $derived(addon ? 'rounded-tl-sm rounded-bl-sm' : 'rounded-sm');
	const labelClasses =
		'flex rounded-tl-sm rounded-tr-sm w-full min-h-6 px-3 pt-2 pb-0.5 whitespace-normal font-bold text-sm font-semibold leading-4 self-center items-center gap-1';
	const labelTxtClasses = 'text-surface-600 group-focus-within:text-surface-950 flex items-center gap-0.5 text-xs select-none';
	const inputWrapperClasses = 'rounded-bl-sm rounded-br-sm pb-1';
	const addonClasses =
		'rounded-tl-0 rounded-bl-0 bg-surface-200 group-focus-within:bg-surface-300 inline-flex items-center justify-center px-3  text-sm font-medium rounded-tr-sm rounded-br-sm';
	const issuesClasses = 'text-error-600 mt-1 text-xs font-medium';
</script>

<div class={fieldInputClasses}>
	<div class={fieldsClasses}>
		<div class="{fieldInternalClasses} {fieldClassesRounded} {fieldClasses}">
			<label class={labelClasses} for={id} {...rest}>
				<span class={labelTxtClasses} class:required>
					{label}
				</span>
			</label>
			<div class={inputWrapperClasses}>
				{#if children}
					{@render children()}
				{:else}
					<span>No renderable input component provided.</span>
				{/if}
			</div>
		</div>
		{#if addon}
			<div class={addonClasses}>
				{@render addon?.()}
			</div>
		{/if}
	</div>

	<div class={issuesClasses}>
		{#each issues as issue, i (i)}
			<p class="">{issue.message}</p>
		{/each}
	</div>
</div>

<style>
	.required::after {
		vertical-align: top;
		content: '*';
		color: var(--color-error-600);
		margin: -5px 0 0 2px;
		font-size: 0.75em;
		line-height: 1;
	}
</style>
