<script lang="ts">
	import '$lib/css/app.css';
	import { Icons } from '$lib/components/icons';
	import { Toasts, createToaster } from '$lib/components/ui/toast';
	import { initGlobalContext } from '$lib/app/global.svelte';
	import Guard from '$lib/components/layouts/Guard.svelte';

	let { children } = $props();

	const global = initGlobalContext();
	const toasterName = 'app-toaster';

	createToaster({ name: toasterName });
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<Icons />
<Toasts {toasterName} />

<Guard>
	{@render children?.()}
</Guard>
