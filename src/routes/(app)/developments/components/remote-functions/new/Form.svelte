<!-- <script lang="ts" module>
	type T = Record<string, unknown>;
</script> -->

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { RemoteForm } from '@sveltejs/kit';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['form'] & {
		children: Snippet;
		remoteForm: RemoteForm<T>;
	};

	let { children, remoteForm, class: classes, ...attributes }: Props = $props();
</script>

<form
	class={classes}
	{...attributes}
	{...remoteForm.enhance(async ({ form, data, submit }) => {
		try {
			// await submit().updates(getLogs()); // client single-flight mutations
			await submit();
			form.reset();

			console.log('Successfully published!');
		} catch (error) {
			console.error('Oh no! Something went wrong');
		}
	})}
>
	{@render children?.()}
</form>

<!-- {#if remoteForm.result?.success}
	<p>Successfully published!</p>
{/if} -->
