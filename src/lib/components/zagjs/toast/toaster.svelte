<script lang="ts">
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import * as toast from '@zag-js/toast';
	import Toast from './toast.svelte';
	import type { ToasterProps } from './types.js';

	const {
		// Toaster
		toaster
	}: ToasterProps = $props();

	const id = $props.id();
	const service = useMachine(toast.group.machine, () => ({ id: id, store: toaster }));
	const api = $derived(toast.group.connect(service, normalizeProps));

	console.log(service);
</script>

<div {...api.getGroupProps()} data-testid="toaster-root">
	{#each api.getToasts() as newToastOptions, index (newToastOptions.id)}
		<Toast {newToastOptions} {index} parent={service}></Toast>
	{/each}
</div>
