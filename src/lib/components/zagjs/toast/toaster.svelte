<script lang="ts">
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import * as toast from '@zag-js/toast';
	import Toast from './toast.svelte';
	import type { ToasterProps } from './types';

	const { toaster, children }: ToasterProps = $props();

	const id = $props.id();
	const service = useMachine(toast.group.machine, () => ({ id: id, store: toaster }));
	const api = $derived(toast.group.connect(service, normalizeProps));
</script>

<div {...api.getGroupProps()} class="min-w-11/12 sm:min-w-lg" data-testid="toaster-root">
	{#each api.getToasts() as newToastOptions, index (newToastOptions.id)}
		<Toast {newToastOptions} {index} parent={service}></Toast>
	{/each}
</div>

{#if children}
	{@render children?.()}
{/if}
