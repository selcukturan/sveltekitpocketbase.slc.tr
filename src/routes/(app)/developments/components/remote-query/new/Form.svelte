<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { RemoteForm } from '@sveltejs/kit';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['form'] & {
		remoteFunction: RemoteForm<T>;
		children?: Snippet;
	};

	let {
		children,
		remoteFunction,
		class: classes,
		...attributes
	}: Props = $props();
</script>

<form
	class={classes}
	{...attributes}
	{...remoteFunction.enhance(async ({ form, data, submit }) => {
		try {
			// await submit().updates(getLogs()); // client single-flight mutations
			await submit();
			form.reset();

			alert('Successfully published!');
		} catch (error) {
			alert('Oh no! Something went wrong');
		}
	})}
>
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</form>

{#if remoteFunction.result?.success}
	<p>Successfully published!</p>
{/if}
