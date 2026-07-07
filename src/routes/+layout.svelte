<script lang="ts">
	import '$lib/css/app.css';
	import { Icons } from '$lib/components/icons';
	import { Toasts, createToaster } from '$lib/components/ui/toast';

	let { children } = $props();

	const toasterName = 'app-toaster';

	createToaster({ name: toasterName });
</script>

<Icons />
<Toasts {toasterName} />

{@render children?.()}
