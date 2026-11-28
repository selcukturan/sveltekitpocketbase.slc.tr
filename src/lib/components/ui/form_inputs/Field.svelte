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

	// Etiket kutunun üstünde; kutu (.slc-field, s07_base.css) çerçeveyi ve odak halkasını çizer, içindeki girdi saydamdır
	// (inputClasses.variants['with-field']).
	const fieldInputClasses = 'flex flex-col gap-1.5 py-2';
	const fieldsClasses = 'group flex w-full items-stretch';
	const fieldInternalClasses = 'slc-field w-full min-w-0 relative flex flex-col justify-center min-h-9';
	const fieldClassesRounded = $derived(addon ? 'rounded-l-lg' : 'rounded-lg');
	// Etiket veriden ayrışsın: daha küçük (13px) ve soluk (surface-600); veri text-sm ve surface-950
	const labelClasses = 'flex w-fit items-center gap-1 text-[13px] leading-4 font-medium text-surface-600 select-none';
	const addonClasses = 'slc-field-addon inline-flex items-center justify-center px-3 text-sm font-medium rounded-r-lg';
	const issuesClasses = 'text-error-600 text-xs font-medium empty:hidden';
</script>

<div class={fieldInputClasses}>
	<label class={labelClasses} for={id} {...rest}>
		<span class:required>{label}</span>
	</label>
	<div class={fieldsClasses}>
		<div class="{fieldInternalClasses} {fieldClassesRounded} {fieldClasses}">
			{#if children}
				{@render children()}
			{:else}
				<span>No renderable input component provided.</span>
			{/if}
		</div>
		{#if addon}
			<div class={addonClasses}>
				{@render addon?.()}
			</div>
		{/if}
	</div>

	<!-- role="status": hata çıkınca/değişince ekran okuyucu duyurur (kibar, yazmayı bölmez) -->
	<div class={issuesClasses} role="status">
		{#each issues as issue, i (i)}
			<p>{issue.message}</p>
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
